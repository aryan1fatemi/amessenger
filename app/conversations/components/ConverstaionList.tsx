'use client';
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { use, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { find, uniq } from 'lodash';
import useConversation from "@/app/hooks/useConversations";
import { pusherClient } from "@/app/libs/pusher";
import ConversationBox from "./ConversationBox";
import { FullConversationType } from "@/app/types";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import GroupChatModal from "./GroupChatModal";

interface ConversationListProps {
    initialItems: FullConversationType[];
    users: User[];
    title?: string;
}

const ConverstaionList:React.FC<ConversationListProps> = ({
    initialItems,users
    }) => {
    const session = useSession();
    const [items, setItems] = useState(initialItems);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const pusherKey=useMemo(()=>{return session.data?.user?.email;},[session.data?.user?.email]);
    const router = useRouter();
    const { conversationId, isOpen } = useConversation();
  
    useEffect(() => {
      if (!pusherKey) {
        return;
      }
  
      pusherClient.subscribe(pusherKey);
  
      const updateHandler = (conversation: FullConversationType) => {
        setItems((current) => current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages
            };
          }
  
          return currentConversation;
        }));
      }
  
      const newHandler = (conversation: FullConversationType) => {
        setItems((current) => {
          if (find(current, { id: conversation.id })) {
            return current;
          }
  
          return [conversation, ...current]
        });
      }
  
      const removeHandler = (conversation: FullConversationType) => {
        setItems((current) => {
          return [...current.filter((convo) => convo.id !== conversation.id)]
        });
      }
  
      pusherClient.bind('conversation:update', updateHandler)
      pusherClient.bind('conversation:new', newHandler)
      pusherClient.bind('conversation:remove', removeHandler)
    }, [pusherKey, router]);
    

    return (
        <>
            <GroupChatModal 
            isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} users={users}/>
            <aside className={clsx(`
            fixed 
            inset-y-0 
            pb-20
            lg:pb-0
            lg:left-20 
            lg:w-80 
            lg:block
            overflow-y-auto 
            border-r 
            border-slate-300 
            `, isOpen ? 'hidden' : 'block w-full left-0')}>
            <div className="px-5">
                <div className="flex justify-between mb-4 pt-4">
                    <div className="text-2xl font-bold text-slate-800">
                        Messeges
                    </div>
                    <div 
                        onClick={() => setIsModalOpen(true)}
                        className="rounded-full 
                        p-2
                        bg-slate-100 
                        text-slate-600 
                        cursor-pointer 
                        hover:opacity-75 
                        transition">
                        <AiOutlineUsergroupAdd size={20} />
                    </div>

                </div>
                {items.map((item) => (<ConversationBox 
                    key={item.id}
                    data={item}
                    selected={conversationId === item.id}/>
                ))}
            </div>
            
            </aside>
        </>
    )
    }
    export default ConverstaionList;