"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import AdminActionButtons from "@/components/admin/admin-action-buttons";
import AdminTableActions from "@/components/admin/admin-table-actions";
import AdminHeader from "@/components/admin/admin-header";
import { 
  AdminInput, 
  AdminFileUpload 
} from "@/components/admin/form";
import {
  AdminTable,
  AdminTableHeader,
  AdminTableRow,
  AdminTableCell
} from "@/components/admin/table";

interface Sponsor {
  id: string;
  name: string;
  website: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function SponsorsAdmin() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Fetch sponsors
  useEffect(() => {
    async function fetchSponsors() {
      try {
        const { data, error } = await supabase
          .from("sponsors")
          .select("*")
          .order("name");

        if (error) throw error;
        setSponsors(data || []);
      } catch (error: any) {
        console.error("Error fetching sponsors:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSponsors();
  }, []);

  // Reset form
  const resetForm = () => {
    setName("");
    setWebsite("");
    setLogoUrl("");
    setLogoFile(null);
    setLogoPreview(null);
    setEditingId(null);
  };

  // Handle logo file selection
  const handleLogoChange = (file: File | null) => {
    if (!file) return;
    setLogoFile(file);
    
    // Create a preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  // Remove logo
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoUrl("");
  };

  // Upload logo to Supabase Storage
  const uploadLogo = async (sponsorId: string): Promise<string | null> => {
    if (!logoFile) return logoUrl; // If no new file, return existing URL

    setUploading(true);
    try {
      // Create a unique filename using sponsor ID and timestamp
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${sponsorId}_${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('sponsors')
        .upload(filePath, logoFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('sponsors')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error("Error uploading logo:", error);
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
      // Determine the sponsor ID (existing or new)
      let sponsorId = editingId || crypto.randomUUID();
      
      // Upload logo if a file is selected
      let finalLogoUrl = logoUrl;
      if (logoFile) {
        const uploadedUrl = await uploadLogo(sponsorId);
        if (uploadedUrl) finalLogoUrl = uploadedUrl;
      }

      const sponsorData = {
        name,
        website: website || null,
        logo_url: finalLogoUrl || null,
      };

      let result;
      if (editingId) {
        // Update existing sponsor
        result = await supabase
          .from("sponsors")
          .update(sponsorData)
          .eq("id", editingId);
      } else {
        // Create new sponsor
        result = await supabase
          .from("sponsors")
          .insert({ ...sponsorData, id: sponsorId });
      }

      if (result.error) throw result.error;

      // Refresh sponsors list
      const { data } = await supabase
        .from("sponsors")
        .select("*")
        .order("name");
      setSponsors(data || []);

      // Reset form
      resetForm();
    } catch (error: any) {
      console.error("Error saving sponsor:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit sponsor
  const handleEdit = (sponsor: Sponsor) => {
    setEditingId(sponsor.id);
    setName(sponsor.name);
    setWebsite(sponsor.website || "");
    setLogoUrl(sponsor.logo_url || "");
    setLogoPreview(sponsor.logo_url);
  };

  // Delete sponsor
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sponsor?")) return;

    setLoading(true);
    try {
      // Find the sponsor to get the logo URL
      const sponsorToDelete = sponsors.find(s => s.id === id);
      
      // Delete from database
      const { error } = await supabase.from("sponsors").delete().eq("id", id);
      if (error) throw error;

      // Delete the logo from storage if it exists and starts with our storage URL
      if (sponsorToDelete?.logo_url && sponsorToDelete.logo_url.includes('supabase.co/storage')) {
        // Extract the path from the URL
        // Expected format: https://xxx.supabase.co/storage/v1/object/public/sponsors/logos/filename
        const pathParts = sponsorToDelete.logo_url.split('/public/sponsors/');
        if (pathParts.length > 1) {
          const filePath = pathParts[1];
          await supabase.storage.from('sponsors').remove([filePath]);
        }
      }

      // Refresh sponsors list
      setSponsors(sponsors.filter((sponsor) => sponsor.id !== id));
    } catch (error: any) {
      console.error("Error deleting sponsor:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <AdminHeader title="Manage Sponsors" />

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sponsors List */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Sponsors</h2>
          
          <AdminTable
            loading={loading}
            isEmpty={sponsors.length === 0}
            emptyText="No sponsors found"
          >
            <AdminTableHeader
              columns={["Logo", "Name", "Website", "Actions"]}
            />
            <tbody>
              {sponsors.map((sponsor) => (
                <AdminTableRow key={sponsor.id}>
                  <AdminTableCell className="w-14">
                    {sponsor.logo_url ? (
                      <div className="w-12 h-12 overflow-hidden flex items-center justify-center">
                        <img 
                          src={sponsor.logo_url} 
                          alt={sponsor.name} 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">{sponsor.name.charAt(0)}</span>
                      </div>
                    )}
                  </AdminTableCell>
                  <AdminTableCell>{sponsor.name}</AdminTableCell>
                  <AdminTableCell>
                    {sponsor.website && (
                      <a 
                        href={sponsor.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-500 hover:underline"
                      >
                        {new URL(sponsor.website).hostname}
                      </a>
                    )}
                  </AdminTableCell>
                  <AdminTableCell>
                    <AdminTableActions
                      onEdit={() => handleEdit(sponsor)}
                      onDelete={() => handleDelete(sponsor.id)}
                    />
                  </AdminTableCell>
                </AdminTableRow>
              ))}
            </tbody>
          </AdminTable>
        </div>

        {/* Sponsor Form */}
        <div className="p-6 bg-[var(--background-secondary)]">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Sponsor" : "Add New Sponsor"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminInput
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sponsor name"
              required
            />

            <AdminInput
              label="Website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
            />

            <AdminFileUpload
              label="Logo"
              previewUrl={logoPreview || logoUrl}
              onFileChange={handleLogoChange}
              onRemove={handleRemoveLogo}
              accept="image/*"
              helpText="Upload an image file or provide a URL below"
              previewClassName="items-start"
            />
            
            <AdminInput
              label="Logo URL"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              disabled={!!logoFile}
            />

            <div className="flex gap-2">
              <AdminActionButtons
                isSubmitting={loading}
                isUploading={uploading}
                isEditing={!!editingId}
                entityName="Sponsor"
                onCancel={resetForm}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 