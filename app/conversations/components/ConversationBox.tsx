'use client';

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { format } from "date-fns";
import { FullConversationType } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUsers";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";

 interface ConversationBoxProps {
    data: FullConversationType,
    selected?: boolean
 }

const ConversationBox: React.FC<ConversationBoxProps> = ({data, selected}) => {

    const otherUser= useOtherUser(data)

    const session= useSession()

    const router = useRouter()

    const handleClick= useCallback(() => {router.push(`/conversations/${data.id}`)},[data.id, router])

    const lastMessege= useMemo(() => {const messseges= data.messages || [];
    return messseges[messseges.length-1]},[data.messages])

    const userEmail = useMemo(() => session.data?.user?.email,
    [session.data?.user?.email]);
    
    const hasSeen = useMemo(() => {
        if (!lastMessege) {
          return false;
        }
    
        const seenArray = lastMessege.seen || [];
    
        if (!userEmail) {
          return false;
        }
    
        return seenArray
          .filter((user) => user.email === userEmail).length !== 0;
      }, [userEmail, lastMessege]);
      
      const lastMessegeText = useMemo(() => {if(lastMessege?.image){
        return 'sent an image'
      
      }
      if(lastMessege?.body){
        return lastMessege.body
      }

      return 'Started conversation'
    },[lastMessege])
    return (
    <div onClick={handleClick} 
    className={clsx(`
      w-full 
      relative 
      flex 
      items-center 
      space-x-3 
      p-3 
      hover:bg-slate-100
      rounded-lg
      transition
      cursor-pointer
      `,
      selected ? 'bg-slate-100' : 'bg-white'
    )}>
      {data.isGroup?(<AvatarGroup users={data.users}/>) : (<Avatar user={otherUser} />)}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex items-center justify-between mb-1">
            <p className="text-md font-medium text-slate-900 ">
              {data.name || otherUser?.name}
            </p>
            {lastMessege?.createdAt && (
              <p 
              className="text-xs 
              text-slate-400 
              font-light">
                {format(new Date(lastMessege.createdAt), 'p')}
              </p>
            )}
          </div>
            <p 
              className={clsx(`
                truncate 
                text-sm
                `,
                hasSeen ? 'text-slate-600' : 'text-black font-medium'
              )}>
                {lastMessegeText}
            </p>
        </div>

      </div>

    </div>
  )
}

export default ConversationBox