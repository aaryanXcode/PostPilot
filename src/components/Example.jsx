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
import { PostContent, PostSchedule } from '../Services/ContentPostService';
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

  //post content
  const handlePostNow = async (generatedContent) => {
    try {
      // API call here
      const response = await PostContent(generatedContent, token);
      console.log("Posting now:", response);
      // await PostNowService(generatedContent, token);
      toast.success("Content posted successfully!");
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
    <div className="flex flex-col w-full h-full p-4 rounded-lg">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 p-8">
          <h2 className="text-2xl font-semibold mb-4">How can I help you today?</h2>
          {role==="ADMIN" && 
            <Suggestions>
              {starterPrompts.map((prompt) => (
                <Suggestion
                  key={prompt}
                  suggestion={prompt}
                  onClick={() => handleSubmit({ preventDefault: () => {}, target: { value: prompt } })}
                />
              ))}
            </Suggestions>
          }
        </div>
      )}

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
                <GeneratedContentCard
                  content={message.generatedContent}
                  isConnected ={isConnected}
                  onPostNow={()=>handlePostNow(message.generatedContent)}
                  onSchedule={(dateTime) => {
                    handleSchedule({ ...message.generatedContent, dateTime })
                  }}
                  onConnect={()=>handleConnectPlatform(message.generatedContent.platform)}
                />
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
            <PromptInputPlatformSelect value={platform} onValueChange={setPlatform} className="mr-2" />
            <PromptInputContentTypeSelect value={contentType} onValueChange={setContentType} />
          </PromptInputTools>
          <PromptInputSubmit disabled={!text} status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};

export default Example;
