'use client';


import axios from 'axios';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { 
  FieldValues, 
  SubmitHandler, 
  useForm 
} from 'react-hook-form';
import { User } from '@prisma/client';
import { toast } from 'react-hot-toast';
import Modal from '@/app/components/Modal';
import Input from '@/app/components/inputs/Input';
import Select from '@/app/components/inputs/Select';
import Button from '@/app/components/Button';

interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: User[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({isOpen, onClose, users=[]}) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      members: []
    }
  });

  const members = watch('members');

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
  
    axios.post('/api/conversations', {
      ...data,
      isGroup: true
    })
    .then(() => {
      router.refresh();
      onClose();
    })
    .catch(() => toast.error('Something went wrong!'))
    .finally(() => setIsLoading(false));
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-slate-900/10 pb-12">
            <h2 className='text-based text-slate-900 font-semibold leading-8 '>
              Create Group Chat here!
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-700">
            It's time to gather all the cool users and create a purrfectly pawsome group chat. 
            Get ready for some meowtastic conversations. Share your tales, and exchange hilarious cat memes that will make even the grumpiest cat crack a smile. Get those paws typing and let the meowgic begin!
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input 
                disabled={isLoading}
                label="Name" 
                id="name" 
                errors={errors} 
                required 
                register={register}/>

              <Select
                disabled={isLoading}
                label="Members" 
                options={users.map((user) => ({ 
                  value: user.id, 
                  label: user.name 
                }))} 
                onChange={(value) => setValue('members', value, { 
                  shouldValidate: true 
                })} 
                value={members}
              />
              
            </div>
          </div>

        </div>
        <div className='mt-6 flex items-center justify-end gap-x-6'>
                <Button 
                  disabled={isLoading}
                  onClick={onClose} 
                  type="button"
                  secondary>
                  Cancel
                </Button>
                <Button disabled={isLoading} type="submit">
                  Create
                </Button>
        </div>
      </form>
    </Modal>
  )
}

export default GroupChatModal;