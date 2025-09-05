'use client';

import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ui/shadcn-io/ai/prompt-input';
import { Action, Actions } from '@/components/ui/shadcn-io/ai/actions';
import { Conversation, ConversationContent } from '@/components/ui/shadcn-io/ai/conversation';
import { Message, MessageContent } from '@/components/ui/shadcn-io/ai/message';
import {
  CopyIcon,
  RefreshCcwIcon,
  ShareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  PaperclipIcon,
  // MicIcon,
} from 'lucide-react';

import { nanoid } from 'nanoid';
import { useState } from 'react';
import { toast } from 'sonner';
import { geminiChatApi } from '../Services/GeminiChatApi';
import { Response } from "@/components/ui/shadcn-io/ai/response";
import { Loader } from "@/components/ui/shadcn-io/ai/loader";
import { Suggestions, Suggestion } from "@/components/ui/shadcn-io/ai/suggestion";

const models = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
  { id: 'gemini-2.5-flash', name: 'gemini-2.5-flash' },
];

const starterPrompts = [
  "What can you help me with?",
  "Explain how AI works in simple terms",
  "Give me creative project ideas",
];


const Example = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [model, setModel] = useState(models[0].id);
  const [status, setStatus] = useState('idle'); // idle | loading
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!text.trim()) return;

  const newUserMessage = {
    key: nanoid(),
    from: 'user',
    content: text,
    avatar: 'https://github.com/dovazencot.png',
    name: 'You',
  };

  setMessages((prev) => [...prev, newUserMessage]);
  setText('');
  setStatus('loading');

  try {
    const response = await geminiChatApi(text);

    const aiResponse = {
      key: nanoid(),
      from: 'assistant',
      content: response,
      avatar: 'https://github.com/openai.png',
      name: model,
    };

    setMessages((prev) => [...prev, aiResponse]);
  } catch (error) {
    console.error('Error fetching AI response:', error);
    const errorResponse = {
      key: nanoid(),
      from: 'assistant',
      content: '⚠️ Something went wrong. Please try again.',
      avatar: 'https://github.com/openai.png',
      name: 'AI Assistant',
    };
    setMessages((prev) => [...prev, errorResponse]);
  } finally {
    setStatus('idle');
  }
};


  const handleRetry = () => {
    console.log('Retry last message...');
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    toast("Copied to Clipboard!");
    
  };

  const handleShare = () => {
    console.log('Share action triggered');
  };

  const actions = (message) => [
    {
      icon: RefreshCcwIcon,
      label: 'Retry',
      onClick: handleRetry,
    },
    {
      icon: ThumbsUpIcon,
      label: 'Like',
      onClick: () => setLiked(!liked),
    },
    {
      icon: ThumbsDownIcon,
      label: 'Dislike',
      onClick: () => setDisliked(!disliked),
    },
    {
      icon: CopyIcon,
      label: 'Copy',
      onClick: () => handleCopy(message.content),
    },
    {
      icon: ShareIcon,
      label: 'Share',
      onClick: () => handleShare(),
    },
  ];

  return (
    
    <div className="flex flex-col w-full h-full p-4  rounded-lg">
      {messages.length === 0 && (
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-4">How can I help you today?</h2>
        <Suggestions>
          {starterPrompts.map((prompt) => (
            <Suggestion
              key={prompt}
              suggestion={prompt}
              onClick={() => handleSubmit(prompt)}
            />
          ))}
        </Suggestions>
      </div>
    )}
      {/* Conversation */}
      
      <Conversation className="flex-1 overflow-y-auto mb-4">
        <ConversationContent>
          {messages.map((message) => (
            <Message
              key={message.key}
              className={`flex flex-col gap-2 ${
                message.from === 'assistant' ? 'items-start' : 'items-end'
              }`}
              from={message.from}
            >
              <MessageContent>
                <Response>{message.content}</Response>
              </MessageContent>
              {message.from === 'assistant' && (
                <Actions className="mt-2">
                  {actions(message).map((action) => (
                    <Action
                      key={action.label}
                      label={action.label}
                      onClick={action.onClick}
                    >
                      <action.icon className="size-4" />
                    </Action>
                  ))}
                </Actions>
              )}
            </Message>
          ))}
          {status === "loading" && (
            <div className="flex items-center gap-2 p-4">
              <Loader size={20} />
              <span className="text-muted-foreground text-sm">Thinking...</span>
            </div>
          )}
        </ConversationContent>
      </Conversation>

      {/* Prompt Input */}
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputTextarea
          onChange={(e) => setText(e.target.value)}
          value={text}
          placeholder="Type your message..."
        />
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputButton>
              <PaperclipIcon size={16} />
            </PromptInputButton>
            {/* <PromptInputButton>
              <MicIcon size={16} />
              <span>Voice</span>
            </PromptInputButton> */}
            <PromptInputModelSelect onValueChange={setModel} value={model}>
              <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                {models.map((m) => (
                  <PromptInputModelSelectItem key={m.id} value={m.id}>
                    {m.name}
                  </PromptInputModelSelectItem>
                ))}
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
          </PromptInputTools>
          <PromptInputSubmit disabled={!text} status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};

export default Example;
