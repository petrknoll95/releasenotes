"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";
import AdminActionButtons from "@/components/admin/admin-action-buttons";
import AdminTableActions from "@/components/admin/admin-table-actions";
import AdminHeader from "@/components/admin/admin-header";
import { 
  AdminInput, 
  AdminTextarea, 
  AdminFileUpload 
} from "@/components/admin/form";
import {
  AdminTable,
  AdminTableHeader,
  AdminTableRow,
  AdminTableCell
} from "@/components/admin/table";

interface Guest {
  id: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function GuestsAdmin() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [twitterUrl, setTwitterUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Fetch guests
  useEffect(() => {
    async function fetchGuests() {
      try {
        const { data, error } = await supabase
          .from("guests")
          .select("*")
          .order("name");

        if (error) throw error;
        setGuests(data || []);
      } catch (error: any) {
        console.error("Error fetching guests:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGuests();
  }, []);

  // Reset form
  const resetForm = () => {
    setName("");
    setBio("");
    setAvatarUrl("");
    setAvatarFile(null);
    setAvatarPreview(null);
    setTwitterUrl("");
    setLinkedinUrl("");
    setEditingId(null);
  };

  // Handle avatar file selection
  const handleAvatarChange = (file: File | null) => {
    if (!file) return;
    setAvatarFile(file);
    
    // Create a preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  // Remove avatar
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarUrl("");
  };

  // Upload avatar to Supabase Storage
  const uploadAvatar = async (guestId: string): Promise<string | null> => {
    if (!avatarFile) return avatarUrl; // If no new file, return existing URL

    setUploading(true);
    try {
      // Create a unique filename using guest ID and timestamp
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${guestId}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('guests')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('guests')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      setError(`Upload error: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Determine the guest ID (existing or new)
      let guestId = editingId || crypto.randomUUID();
      
      // Upload avatar if a file is selected
      let finalAvatarUrl = avatarUrl;
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(guestId);
        if (uploadedUrl) finalAvatarUrl = uploadedUrl;
      }

      const guestData = {
        name,
        bio: bio || null,
        avatar_url: finalAvatarUrl || null,
        twitter_url: twitterUrl || null,
        linkedin_url: linkedinUrl || null,
      };

      let result;
      if (editingId) {
        // Update existing guest
        result = await supabase
          .from("guests")
          .update(guestData)
          .eq("id", editingId);
      } else {
        // Create new guest
        result = await supabase
          .from("guests")
          .insert({ ...guestData, id: guestId });
      }

      if (result.error) throw result.error;

      // Refresh guests list
      const { data } = await supabase
        .from("guests")
        .select("*")
        .order("name");
      setGuests(data || []);

      // Reset form
      resetForm();
    } catch (error: any) {
      console.error("Error saving guest:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit guest
  const handleEdit = (guest: Guest) => {
    setEditingId(guest.id);
    setName(guest.name);
    setBio(guest.bio || "");
    setAvatarUrl(guest.avatar_url || "");
    setAvatarPreview(guest.avatar_url);
    setTwitterUrl(guest.twitter_url || "");
    setLinkedinUrl(guest.linkedin_url || "");
  };

  // Delete guest
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this guest?")) return;

    setLoading(true);
    try {
      // Find the guest to get the avatar URL
      const guestToDelete = guests.find(g => g.id === id);
      
      // Delete from database
      const { error } = await supabase.from("guests").delete().eq("id", id);
      if (error) throw error;

      // Delete the avatar from storage if it exists and starts with our storage URL
      if (guestToDelete?.avatar_url && guestToDelete.avatar_url.includes('supabase.co/storage')) {
        // Extract the path from the URL
        // Expected format: https://xxx.supabase.co/storage/v1/object/public/guests/avatars/filename
        const pathParts = guestToDelete.avatar_url.split('/public/guests/');
        if (pathParts.length > 1) {
          const filePath = pathParts[1];
          await supabase.storage.from('guests').remove([filePath]);
        }
      }

      // Refresh guests list
      setGuests(guests.filter((guest) => guest.id !== id));
    } catch (error: any) {
      console.error("Error deleting guest:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <AdminHeader title="Manage Guests" />

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guests List */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Guests</h2>
          
          <AdminTable
            loading={loading}
            isEmpty={guests.length === 0}
            emptyText="No guests found"
          >
            <AdminTableHeader
              columns={["Avatar", "Name", "Actions"]}
            />
            <tbody>
              {guests.map((guest) => (
                <AdminTableRow key={guest.id}>
                  <AdminTableCell className="w-14">
                    {guest.avatar_url ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src={guest.avatar_url} 
                          alt={guest.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">{guest.name.charAt(0)}</span>
                      </div>
                    )}
                  </AdminTableCell>
                  <AdminTableCell>{guest.name}</AdminTableCell>
                  <AdminTableCell>
                    <AdminTableActions
                      onEdit={() => handleEdit(guest)}
                      onDelete={() => handleDelete(guest.id)}
                    />
                  </AdminTableCell>
                </AdminTableRow>
              ))}
            </tbody>
          </AdminTable>
        </div>

        {/* Guest Form */}
        <div className="p-6 bg-[var(--background-secondary)]">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Guest" : "Add New Guest"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminInput
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Guest name"
              required
            />

            <AdminTextarea
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Short bio about the guest"
            />

            <AdminFileUpload
              label="Avatar"
              previewUrl={avatarPreview || avatarUrl}
              onFileChange={handleAvatarChange}
              onRemove={handleRemoveAvatar}
              accept="image/*"
              helpText="Upload an image file or provide a URL below"
            />
            
            <AdminInput
              label="Avatar URL"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              disabled={!!avatarFile}
            />

            <AdminInput
              label="Twitter URL"
              type="url"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              placeholder="https://twitter.com/username"
            />

            <AdminInput
              label="LinkedIn URL"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />

            <div className="flex gap-2">
              <AdminActionButtons
                isSubmitting={loading}
                isUploading={uploading}
                isEditing={!!editingId}
                entityName="Guest"
                onCancel={resetForm}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 