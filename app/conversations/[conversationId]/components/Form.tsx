'use client';

import useConversation from "@/app/hooks/useConversations";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiOutlinePhotograph } from "react-icons/hi";
import MessageInput from "./MessageInput";
import { FaPaperPlane } from "react-icons/fa";
import { CldUploadButton } from "next-cloudinary";

const Form = () => {

  const { conversationId }= useConversation();

  const {register, handleSubmit, setValue, formState: {errors,}}= useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true });
    axios.post('/api/messages', {
      ...data,
      conversationId: conversationId
    })
  }

  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      image: result?.info?.secure_url,
      conversationId
    })
  }

  return (
    <div className="py-4 
    px-4 
    bg-white 
    border-t 
    flex 
    items-center 
    gap-2 
    lg:gap-4 
    w-full">
      <CldUploadButton options={{maxFiles: 1}}
        onUpload={()=>{handleUpload}}
        uploadPreset="ugzwnf9o" 
      >
        <HiOutlinePhotograph size={30} className="text-blue-400"/>
      </CldUploadButton>
      <form onSubmit={handleSubmit(onSubmit)} 
        className="flex items-center gap-2 lg:gap-4 w-full">
        <MessageInput  
          id="message" 
          register={register} 
          errors={errors} 
          required 
          placeholder="Write your message"/>
          <button 
            type="submit" 
            className="
            rounded-full 
            p-2 
            bg-cyan-500 
            cursor-pointer 
            hover:bg-sky-600 
            transition
          "
        >
          <FaPaperPlane
            size={18}
            className="text-white"
          />
        </button>
      </form>

    </div>
  )
}

export default Form