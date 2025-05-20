"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import AdminActionButtons from "@/components/admin/admin-action-buttons";
import AdminTableActions from "@/components/admin/admin-table-actions";
import AdminHeader from "@/components/admin/admin-header";
import {   AdminInput,   AdminTextarea,   AdminSelect,   AdminCheckbox,  AdminDateTime,  AdminCheckboxGroup,  AdminTagInput} from "@/components/admin/form";
import {
  AdminDataTable,
  AdminTableRow,
  AdminTableCell
} from "@/components/admin/table";

interface Episode {
  id: string;
  title: string;
  slug: string;
  yt_video_id: string;
  air_date: string | null;
  start_time: string | null;
  is_live: boolean;
  sponsor_id: string | null;
  sponsors?: {
    name: string;
  };
}

interface Guest {
  id: string;
  name: string;
}

interface Sponsor {
  id: string;
  name: string;
}

export default function EpisodesAdmin() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [ytVideoId, setYtVideoId] = useState("");
  const [airDate, setAirDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [sponsorId, setSponsorId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // New state for guests
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [episodeGuests, setEpisodeGuests] = useState<{[episodeId: string]: Guest[]}>({});

  const supabase = createClient();

  // Fetch episodes
  useEffect(() => {
    async function fetchEpisodes() {
      try {
        const { data, error } = await supabase
          .from("episodes")
          .select("*, sponsors(name)")
          .order("air_date", { ascending: false });

        if (error) throw error;
        setEpisodes(data || []);
        
        // Fetch episode guests for each episode
        await Promise.all((data || []).map(episode => fetchEpisodeGuests(episode.id)));
      } catch (error: any) {
        console.error("Error fetching episodes:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEpisodes();
  }, []);

  // Fetch all guests for selection
  useEffect(() => {
    async function fetchGuests() {
      try {
        const { data, error } = await supabase
          .from("guests")
          .select("id, name")
          .order("name");

        if (error) throw error;
        setAllGuests(data || []);
      } catch (error: any) {
        console.error("Error fetching guests:", error);
      }
    }

    fetchGuests();
  }, []);

  // Fetch guests for a specific episode
  const fetchEpisodeGuests = async (episodeId: string) => {
    try {
      const { data, error } = await supabase
        .from("episode_guests")
        .select("guest_id, order_position")
        .eq("episode_id", episodeId)
        .order("order_position");

      if (error) throw error;

      if (data && data.length > 0) {
        const guestIds = data.map(eg => eg.guest_id);
        
        const { data: guestData, error: guestError } = await supabase
          .from("guests")
          .select("id, name")
          .in("id", guestIds);
          
        if (guestError) throw guestError;
        
        // Maintain the order based on order_position
        const sortedGuests = data.map(eg => {
          return guestData?.find(g => g.id === eg.guest_id);
        }).filter(g => g !== undefined) as Guest[];
        
        setEpisodeGuests(prev => ({
          ...prev,
          [episodeId]: sortedGuests
        }));
      } else {
        setEpisodeGuests(prev => ({
          ...prev,
          [episodeId]: []
        }));
      }
    } catch (error: any) {
      console.error("Error fetching episode guests:", error);
    }
  };

  // Fetch sponsors for dropdown
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  useEffect(() => {
    async function fetchSponsors() {
      const { data } = await supabase.from("sponsors").select("id, name");
      setSponsors(data || []);
    }

    fetchSponsors();
  }, []);

  // Reset form
  const resetForm = () => {
    setTitle("");
    setSlug("");
    setYtVideoId("");
    setAirDate("");
    setStartTime("");
    setIsLive(false);
    setSponsorId("");
    setEditingId(null);
    setSelectedGuests([]);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const episodeData = {
        title,
        slug,
        yt_video_id: ytVideoId,
        air_date: airDate || null,
        start_time: startTime || null,
        is_live: isLive,
        sponsor_id: sponsorId || null,
      };

      let episodeId = editingId;
      
      if (editingId) {
        // Update existing episode
        const { error: updateError } = await supabase
          .from("episodes")
          .update(episodeData)
          .eq("id", editingId);
          
        if (updateError) throw updateError;
      } else {
        // Create new episode
        const { data: newEpisode, error: insertError } = await supabase
          .from("episodes")
          .insert(episodeData)
          .select();
          
        if (insertError) throw insertError;
        if (newEpisode && newEpisode.length > 0) {
          episodeId = newEpisode[0].id;
        }
      }
      
      // Handle episode guests if we have an episode ID
      if (episodeId) {
        // First delete existing guest associations
        const { error: deleteError } = await supabase
          .from("episode_guests")
          .delete()
          .eq("episode_id", episodeId);
          
        if (deleteError) throw deleteError;
        
        // Then add new guest associations with order
        if (selectedGuests.length > 0) {
          const episodeGuestRows = selectedGuests.map((guestId, index) => ({
            episode_id: episodeId,
            guest_id: guestId,
            order_position: index // Add order_position for sorting
          }));
          
          const { error: insertGuestsError } = await supabase
            .from("episode_guests")
            .insert(episodeGuestRows);
            
          if (insertGuestsError) throw insertGuestsError;
        }
      }

      // Refresh episodes list
      const { data } = await supabase
        .from("episodes")
        .select("*, sponsors(name)")
        .order("air_date", { ascending: false });
      setEpisodes(data || []);
      
      // Refresh episode guests data
      await Promise.all((data || []).map(episode => fetchEpisodeGuests(episode.id)));

      // Reset form
      resetForm();
    } catch (error: any) {
      console.error("Error saving episode:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit episode
  const handleEdit = async (episode: Episode) => {
    setEditingId(episode.id);
    setTitle(episode.title);
    setSlug(episode.slug);
    setYtVideoId(episode.yt_video_id);
    setAirDate(episode.air_date || "");
    setStartTime(episode.start_time || "");
    setIsLive(episode.is_live);
    setSponsorId(episode.sponsor_id || "");
    
    // Load episode guests for selection
    try {
      const { data, error } = await supabase
        .from("episode_guests")
        .select("guest_id")
        .eq("episode_id", episode.id);
        
      if (error) throw error;
      
      const guestIds = data?.map(eg => eg.guest_id) || [];
      setSelectedGuests(guestIds);
    } catch (error: any) {
      console.error("Error loading episode guests:", error);
    }
  };

  // Delete episode
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this episode?")) return;

    setLoading(true);
    try {
      // Delete from episode_guests (cascade should handle this automatically, but just to be safe)
      await supabase.from("episode_guests").delete().eq("episode_id", id);
      
      // Delete the episode
      const { error } = await supabase.from("episodes").delete().eq("id", id);
      if (error) throw error;

      // Refresh episodes list
      setEpisodes(episodes.filter((episode) => episode.id !== id));
      
      // Clean up episode guests data
      const updatedEpisodeGuests = {...episodeGuests};
      delete updatedEpisodeGuests[id];
      setEpisodeGuests(updatedEpisodeGuests);
    } catch (error: any) {
      console.error("Error deleting episode:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate slug from title
  const generateSlug = () => {
    if (!title) return;
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
    setSlug(slug);
  };
  
  // Toggle guest selection
  const toggleGuestSelection = (guestId: string) => {
    setSelectedGuests(prev => {
      if (prev.includes(guestId)) {
        return prev.filter(id => id !== guestId);
      } else {
        return [...prev, guestId];
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <AdminHeader title="Manage Episodes">
        <Link 
          href="/admin/guests" 
          className="px-4 py-4 bg-[color-mix(in_srgb,#ffffff_10%,transparent)] hover:bg-[color-mix(in_srgb,#ffffff_20%,transparent)] text-primary font-mono font-medium uppercase text-[12px] leading-none"
        >
          Manage Guests
        </Link>
      </AdminHeader>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Episodes List */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Episodes</h2>
          
          <AdminDataTable
            columns={["Title", "Air Date", "Time", "Guests", "Actions"]}
            data={episodes}
            keyExtractor={(episode) => episode.id}
            loading={loading}
            emptyText="No episodes found"
            renderRow={(episode) => (
              <AdminTableRow>
                <AdminTableCell>{episode.title}</AdminTableCell>
                <AdminTableCell>
                  {episode.air_date
                    ? new Date(episode.air_date).toLocaleDateString()
                    : "Not scheduled"}
                </AdminTableCell>
                <AdminTableCell>
                  {episode.start_time || "N/A"}
                </AdminTableCell>
                <AdminTableCell>
                  {episodeGuests[episode.id]?.length > 0 ? (
                    <div className="flex flex-col">
                      {episodeGuests[episode.id].map(guest => (
                        <span key={guest.id} className="text-xs">
                          {guest.name}
                        </span>
                      ))}
                    </div>
                  ) : "No guests"}
                </AdminTableCell>
                <AdminTableCell>
                  <AdminTableActions
                    onEdit={() => handleEdit(episode)}
                    onDelete={() => handleDelete(episode.id)}
                  />
                </AdminTableCell>
              </AdminTableRow>
            )}
          />
        </div>

        {/* Episode Form */}
        <div className="p-6 bg-[var(--background-secondary)]">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Episode" : "Add New Episode"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminInput
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={generateSlug}
              placeholder="Episode title"
              required
            />

            <AdminInput
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="episode-slug"
              required
            />

            <AdminInput
              label="YouTube Video ID"
              value={ytVideoId}
              onChange={(e) => setYtVideoId(e.target.value)}
              placeholder="dQw4w9WgXcQ"
              required
            />

            <AdminDateTime
              label="Air Date"
              type="date"
              value={airDate}
              onChange={(e) => setAirDate(e.target.value)}
            />
            
            <AdminDateTime
              label="Start Time (Central Time)"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />

            <AdminCheckbox
              label="Is Live"
              id="isLive"
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
            />

            <AdminSelect
              label="Sponsor"
              value={sponsorId}
              onChange={(e) => setSponsorId(e.target.value)}
              options={sponsors.map(sponsor => ({
                value: sponsor.id,
                label: sponsor.name
              }))}
              emptyOption="None"
            />
            
            {/* Guest Selection */}            <AdminTagInput              label="Guests"              options={allGuests.map(guest => ({                value: guest.id,                label: guest.name              }))}              selectedValues={selectedGuests}              onChange={setSelectedGuests}              emptyMessage="No guests available."              helpText="The order of guests will be preserved when displayed."              emptyAction={                <Link href="/admin/guests" className="text-blue-500 underline">                  Add some guests                </Link>              }            />

            <div className="flex gap-2">
              <AdminActionButtons
                isSubmitting={loading}
                isEditing={!!editingId}
                entityName="Episode"
                onCancel={resetForm}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 