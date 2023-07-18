'use client';

import React, { useCallback, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { FiAlertTriangle } from 'react-icons/fi'
import axios from 'axios';
import { useRouter } from 'next/navigation';

import Button from '@/app/components/Button';

import { toast } from 'react-hot-toast';
import useConversation from '@/app/hooks/useConversations';
import Modal from '@/app/components/Modal';
import { GoAlertFill } from 'react-icons/go';





interface ConfirmModalProps {
    isOpen?: boolean;
    onClose: () => void;
  }

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
    isOpen, 
    onClose 
  }) => {

    const router = useRouter();

    const { conversationId } = useConversation();
    
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = useCallback(() => {
        setIsLoading(true);
    
        axios.delete(`/api/conversations/${conversationId}`)
        .then(() => {
          onClose();
          router.push('/conversations');
          router.refresh();
        })
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => setIsLoading(false))
      }, [router, conversationId, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <div className="sm:flex sm:items-start">
            <div className='mx-auto 
            flex 
            h-12 
            w-12 
            flex-shrink-0 
            items-center 
            justify-center 
            rounded-full 
            bg-red-100 
            sm:mx-0 
            sm:h-10 
            sm:w-10'>
                <GoAlertFill className='h-6 w-6 text-rose-600'/>
            </div>
            <div className='mt-3 
            text-center 
            sm:ml-4 
            sm:mt-0 
            sm:text-left'>
            <Dialog.Title 
                as="h3" 
                className="text-base font-semibold leading-6 text-gray-900">
                Delete conversation
            </Dialog.Title>
            <div className='mt-2'>
                <p className='text-sm text-slate-600'>
                Uh-oh! Deleting this conversation? Well, hold on tight! Once you hit that delete button, it's gone forever, 
                never to return. No undo, no magical revival spell. So, are you absolutely, positively,
                 and fearlessly sure you want to bid farewell to our digital chitchat? Choose wisely, my friend!
                </p>
            </div>
            </div>
        </div>
        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
            <Button
                disabled={isLoading}
                danger
                onClick={onDelete}>
                DELETE!
            </Button>
            <Button
                disabled={isLoading}
                secondary
                onClick={onClose}>
                CANCLE
            </Button>
        </div>
    </Modal>
  )
}

export default ConfirmModal