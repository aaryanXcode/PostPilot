"use client";

import { Button } from "@/components/ui/button";
import { CalendarIcon, SendIcon, PlugIcon } from "lucide-react";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import { Calendar24 } from "../DateTimePicker";
const GeneratedContentCard = ({ 
  content, 
  platformType = "LinkedIn", 
  isConnected = false, 
  onPostNow, 
  onSchedule, 
  onConnect 
}) => {
  if (!content) return null;

  return (
    <div className="mt-3 w-full max-w-2xl">
      <div className="rounded-xl border bg-background shadow-sm p-4 space-y-4">
        {/* Title */}
        {content.title && (
          <h4 className="text-lg font-semibold">{content.title}</h4>
        )}

        {/* Main AI response style content */}
        {content.content && <Response>{content.content}</Response>}

        {/* Hashtags */}
        {content.hashtags && (
          <div className="flex flex-wrap gap-2">
            {content.hashtags.split(" ").map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Image gallery */}
        {content.imageUrls?.length > 0 && (
          <div className="flex gap-3 overflow-x-auto">
            {content.imageUrls.map((img) => (
              <div
                key={img.id}
                className="flex-shrink-0 rounded-lg overflow-hidden border w-36 h-36"
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
        <div className="flex justify-end gap-2 pt-2 border-t">
          {isConnected ? (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={onPostNow}
                className="flex items-center gap-1"
              >
                <SendIcon className="w-4 h-4" /> Post Now
              </Button>
              <Calendar24
        onConfirm={(dateTime) => {
          onSchedule(dateTime)
        }}
      />
            </>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={onConnect}
              className="flex items-center gap-1"
            >
              <PlugIcon className="w-4 h-4" /> Connect {platformType}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratedContentCard;
