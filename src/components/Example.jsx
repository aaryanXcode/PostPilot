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
import { PromptInputPlatformSelect } from '@/components/ui/shadcn-io/ai/prompt-input-platform-select';
import { PromptInputContentTypeSelect } from '@/components/ui/shadcn-io/ai/prompt-input-content-type-select';
import { Action, Actions } from '@/components/ui/shadcn-io/ai/actions';
import { Conversation, ConversationContent } from '@/components/ui/shadcn-io/ai/conversation';
import { Message, MessageContent } from '@/components/ui/shadcn-io/ai/message';
import GeneratedContentCard from './ui/GeneratedPost';
import {
  CopyIcon,
  RefreshCcwIcon,
  ShareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  PaperclipIcon,
  Home
} from 'lucide-react';

import { nanoid } from 'nanoid';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ChatService } from '../Services/ChatService';
import { Response } from "@/components/ui/shadcn-io/ai/response";
import { Loader } from "@/components/ui/shadcn-io/ai/loader";
import { Suggestions, Suggestion } from "@/components/ui/shadcn-io/ai/suggestion";
import { useAuth } from "@/components/AuthContext";
import { ChatMessageHistory } from "../Services/ChatService";
import { useParams } from 'react-router-dom';
import { useMessages } from "@/components/ChatMessageContextProvider";
import { PostContent, PostSchedule, UpdatePostContent } from '../Services/ContentPostService';
import { LinkedInAuthService, LinkedInAuthStatusService } from '../Services/LinkedInAuthService';


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
  const [userId, setUserId] = useState(1);
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [model, setModel] = useState(models[2].id);
  const [status, setStatus] = useState('idle'); // idle | loading
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const { token, role } = useAuth(); 
  const { sessionIdSidebar } = useParams();
  const [platform, setPlatform] = useState('default');
  const [contentType, setContentType] = useState('TEXT');
  const { chatMessage, chatList, setChatList } = useMessages();
  const [isConnected, setIsConnected] = useState(false);
  


  useEffect(() => {
        const checkAuthStatus = async () => {
            const status = await LinkedInAuthStatusService(token);
            setIsConnected(status.authenticated && status.hasToken);
        };
        checkAuthStatus();
  }, [token]);

  useEffect(() => {
    if (!sessionIdSidebar) return;
  
    setSessionId(sessionIdSidebar);
    const fetchMessages = async () => {
      try {
        const data = await ChatMessageHistory(sessionIdSidebar, token, 0, 20); // page 0, size 20
        if (data && !data.error) {
          const loadedMessages = data.content.map(msg => ({
            key: msg.id,
            from: msg.messageType.toLowerCase(),
            content: msg.content,
            avatar: msg.messageType === 'ASSISTANT'
              ? 'https://github.com/openai.png'
              : 'https://github.com/dovazencot.png',
            name: msg.messageType === 'ASSISTANT' ? 'AI' : 'You',
            generatedContent: msg.generateContentDTO,
          }));
          console.log(loadedMessages);
          setMessages(loadedMessages.reverse());
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    fetchMessages();
  }, [sessionIdSidebar, token]);

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
      const response = await ChatService({
                                          userId : userId,
                                          sessionId: sessionId,
                                          prompt: text, 
                                          model: model,
                                          platform: platform,
                                          contentType: contentType,
                                          targetAudience: "IT Enterprise",
                                          tone: "Professional",
                                          maxCharacters: 280
                                        }, token);

      if (response?.sessionId) {
        setSessionId(response.sessionId);
        const newChat = {
          sessionId: response.sessionId,
          title: response.title || "New Chat",   // make sure backend returns a title
          url: `/chat/${response.sessionId}`,
          icon: Home
        };
        setChatList(prev => {
          const idx = prev.findIndex(c => c.sessionId === response.sessionId);

          if (idx > -1) {
            // Update only if the old title is "New Chat" or empty
            if (!prev[idx].title || prev[idx].title === "New Chat") {
              const updated = [...prev];
              updated[idx] = { ...prev[idx], ...newChat };
              return updated;
            }
            return prev; // no update if title already exists
          }

          // Session not found → append as new
          return [...prev, newChat];
        });
      }
      

      const aiResponse = {
        key: nanoid(),
        from: 'assistant',
        content: response?.content,
        avatar: 'https://github.com/openai.png',
        name: model,
        generatedContent: response?.generateContentDTO || null,
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

  //Edit post content
  const handlePostNow = async (generatedContent) => {
    try {
      // API call here
      const response = await PostContent(generatedContent, token);
      toast.success("Content updated successfully!");
    } catch (err) {
      toast.error("Failed to post");
    }
  };
//schedulecontent
const handleSchedule = async (scheduledContent) => {
  try {
    //console.log("scheduledContent id:", scheduledContent.id);
    //console.log("dateTime:", scheduledContent.dateTime);

    const response = await PostSchedule(scheduledContent, token);

    //console.log("Schedule API response:", response);

    toast.success(`✅ ${JSON.stringify(response)}`);
  } catch (err) {
    console.error("Schedule error:", err);
    toast.error("❌ Failed to schedule post");
  }
};


const handleConnectPlatform = async (platform, token) => {
  try {
    if (platform === "LinkedIn") {
      if (isConnected) {
        toast.info("Already connected to LinkedIn");
        return;
      }
      const result = await LinkedInAuthService(token);
      
      if (result?.authUrl) {
        window.location.href = result.authUrl;
      } else {
        throw new Error("No auth URL received from server");
      }

      toast.success("Redirecting to LinkedIn...");
    } else {
      toast.error("Unsupported platform");
    }
  } catch (err) {
    console.error("Error in handleConnectPlatform:", err);
    toast.error("Failed to connect LinkedIn");
  }
};

const handlePostEdit = async (generateContentDTO, token) => {
  if (!token) {
      console.error("No JWT token provided!");
      toast.error("Cannot update: user not authenticated");
      return;
    }
  try {
    const result = UpdatePostContent(generateContentDTO, token);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Content updated successfully");
    }
  } catch (err) {
    console.error("Error in handleConnectPlatform:", err);
    toast.error("Failed to connect LinkedIn");
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
  <div className="flex flex-col h-screen w-full">
    {/* Scrollable conversation area */}
    <div className="flex-1 overflow-y-auto p-2 sm:p-4">
      {messages.length === 0 ? (
      <div className="flex flex-col w-full p-2 sm:p-4">
        <Suggestions className="w-full max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-2">
            {starterPrompts.map((prompt) => (
              <Suggestion
                key={prompt}
                suggestion={prompt}
                onClick={() =>
                  handleSubmit({
                    preventDefault: () => {},
                    target: { value: prompt },
                  })
                }
                className="flex-1 min-w-[240px] max-w-[280px] sm:min-w-[280px] sm:max-w-[320px] md:min-w-[300px] md:max-w-[350px]"
              />
            ))}
          </div>
        </Suggestions>
      </div>
    ) : (
        <Conversation className="flex flex-col gap-2">
          <ConversationContent className="flex flex-col gap-2">
            {messages.map((message) => (
              <Message
                key={message.key}
                className={`flex flex-col gap-2 ${
                  message.from === "assistant" ? "items-start" : "items-end"
                }`}
                from={message.from}
              >
                <MessageContent>
                  <Response>{message.content}</Response>
                  <GeneratedContentCard
                    content={message.generatedContent}
                    isConnected={isConnected}
                    onPostNow={() => handlePostNow(message.generatedContent)}
                    onSchedule={(dateTime) =>
                      handleSchedule({ ...message.generatedContent, dateTime })
                    }
                    onConnect={() =>
                      handleConnectPlatform(message.generatedContent.platform)
                    }
                    onEdit={(updateContent) =>
                      handlePostEdit(
                        { ...message.generatedContent, content: updateContent },
                        token
                      )
                    }
                  />
                </MessageContent>

                {message.from === "assistant" && (
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
              <div className="flex items-center justify-center p-4 sm:p-6">
                <div className="flex flex-col items-center space-y-3">
                  <Loader size={24} />
                  <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                    AI is thinking...
                  </p>
                </div>
              </div>
            )}
          </ConversationContent>
        </Conversation>
      )}
    </div>

    {/* Fixed input area at bottom */}
    <div className="flex-shrink-0 p-2 sm:pb-32">
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputTextarea
          onChange={(e) => setText(e.target.value)}
          value={text}
          placeholder="Ask me to create social media content..."
          className="min-h-[60px] sm:min-h-[80px] text-sm sm:text-base"
        />
        <PromptInputToolbar>
          <PromptInputTools className="flex flex-nowrap overflow-x-auto gap-1 sm:gap-2 pb-2 scrollbar-hide">
            <PromptInputButton className="flex-shrink-0">
              <PaperclipIcon size={14} className="sm:w-4 sm:h-4" />
            </PromptInputButton>
            <PromptInputModelSelect
              onValueChange={setModel}
              value={model}
              className="flex-shrink-0 min-w-[100px] sm:min-w-[120px]"
            >
              <PromptInputModelSelectTrigger className="text-xs sm:text-sm">
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
            <PromptInputPlatformSelect
              value={platform}
              onValueChange={setPlatform}
              className="flex-shrink-0 min-w-[80px] sm:min-w-[100px]"
            />
            <PromptInputContentTypeSelect
              value={contentType}
              onValueChange={setContentType}
              className="flex-shrink-0 min-w-[80px] sm:min-w-[100px]"
            />
          </PromptInputTools>
          <PromptInputSubmit
            disabled={!text}
            status={status}
            className="flex-shrink-0"
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  </div>
);

};

export default Example;