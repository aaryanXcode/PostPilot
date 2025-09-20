"use client";

import { Button } from "@/components/ui/button";
import { CalendarIcon, SendIcon, PlugIcon,EditIcon } from "lucide-react";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import { Calendar24 } from "../DateTimePicker";
import { useState } from "react";
const GeneratedContentCard = ({ 
  content, 
  platformType = "LinkedIn", 
  isConnected = false, 
  onPostNow, 
  onSchedule, 
  onConnect, 
  onEdit
}) => {
  if (!content) return null;
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(content); 

  const handleSave = () => {
    setIsEditing(false);
    onEdit(draft);
  };

  const handleCancel = () => {
    setDraft(content);
    setIsEditing(false);
  };
  

  return (
    <div className="mt-3 w-full max-w-2xl mx-auto">
      <div className="rounded-xl border bg-background shadow-sm p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Title */}
        {isEditing ? (
          <input
            type="text"
            value={draft.title || ""}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="w-full border px-2 py-1 rounded"
          />
        ) : (
          draft.title && (
            <h4 className="text-base sm:text-lg font-semibold">
              {draft.title}
            </h4>
          )
        )}

        {/* Content */}
        {isEditing ? (
          <textarea
            value={draft.content || ""}
            onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            className="w-full border px-2 py-1 rounded min-h-[100px]"
          />
        ) : (
          draft.content && <Response>{draft.content}</Response>
        )}

        {/* Hashtags */}
        {isEditing ? (
          <input
            type="text"
            value={draft.hashtags || ""}
            onChange={(e) => setDraft({ ...draft, hashtags: e.target.value })}
            className="w-full border px-2 py-1 rounded"
            placeholder="Enter hashtags separated by space"
          />
        ) : (
          draft.hashtags && (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {draft.hashtags.split(" ").map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )
        )}

        {/* Image gallery (skip editing for now) */}
        {draft.imageUrls?.length > 0 && !isEditing && (
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
            {draft.imageUrls.map((img) => (
              <div
                key={img.id}
                className="flex-shrink-0 rounded-lg overflow-hidden border w-24 h-24 sm:w-36 sm:h-36"
              >
                <img
                  src={img.imageUrl}
                  alt={img.altText || "generated image"}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t">
          {isConnected ? (
            isEditing ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  className="flex items-center gap-1 w-full sm:w-auto"
                >
                  Save
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancel}
                  className="flex items-center gap-1 w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 w-full sm:w-auto"
                >
                  <EditIcon className="w-4 h-4" />
                  <span>Edit</span>
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={onPostNow}
                  className="flex items-center gap-1 w-full sm:w-auto"
                >
                  <SendIcon className="w-4 h-4" />
                  <span className="hidden xs:inline">Post Now</span>
                  <span className="xs:hidden">Post</span>
                </Button>
                <Calendar24
                  onConfirm={(dateTime) => {
                    onSchedule(dateTime);
                  }}
                />
              </>
            )
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={onConnect}
              className="flex items-center gap-1 w-full sm:w-auto"
            >
              <PlugIcon className="w-4 h-4" />
              <span className="hidden xs:inline">Connect {platformType}</span>
              <span className="xs:hidden">Connect</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratedContentCard;
