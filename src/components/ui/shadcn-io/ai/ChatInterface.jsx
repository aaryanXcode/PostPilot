'use client';

import { useChat } from '@ai-sdk/react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ui/shadcn-io/ai/conversation';
import { Message, MessageContent } from '@/components/ui/shadcn-io/ai/message';
import { Actions, Action } from '@/components/ui/shadcn-io/ai/actions';
import { RefreshCcwIcon, CopyIcon } from 'lucide-react';

export default function ChatInterface() {
  const { messages, sendMessage, status, regenerate } = useChat();
  const isGenerating = status === 'streaming' || status === 'submitted';

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.target.elements.input.value.trim();
    if (!input) return;
    sendMessage({ text: input });
    e.target.reset();
  };

  return (
    <div className="flex flex-col h-full">
      <Conversation className="flex-1 overflow-auto">
        <ConversationContent>
          {messages.map((message, idx) => (
            <Message from={message.role} key={message.id}>
              <MessageContent>
                {message.parts?.map((part, i) =>
                  part.type === 'text' ? <span key={i}>{part.text}</span> : null
                )}
              </MessageContent>

              {message.role === 'assistant' && idx === messages.length - 1 && (
                <Actions className="mt-2">
                  <Action
                    onClick={regenerate}
                    disabled={isGenerating}
                    label="Retry"
                    tooltip="Regenerate response"
                  >
                    <RefreshCcwIcon className="size-4" />
                  </Action>
                  <Action
                    onClick={() => navigator.clipboard.writeText(message.parts[0].text)}
                    label="Copy"
                    tooltip="Copy text"
                  >
                    <CopyIcon className="size-4" />
                  </Action>
                </Actions>
              )}
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          name="input"
          className="flex-1 rounded border px-3 py-2"
          placeholder="Enter your message..."
          disabled={isGenerating}
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
          disabled={isGenerating}
        >
          Send
        </button>
      </form>
    </div>
  );
}
