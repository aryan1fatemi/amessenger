'use client';

import { signIn, useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { BsGithub, BsGoogle  } from 'react-icons/bs';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";
import Input from "../../components/inputs/Input";
import AuthSocialButton from './AuthSocialButton';
import Button from "@/app/components/Button";
import axios from 'axios';
import { toast } from "react-hot-toast";
import { sign } from 'crypto';
type variant = 'LOGIN' | 'REGISTER';
const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
    const [variant,setVariant] = useState<variant>('LOGIN')
    const [isLoading,setIsLoading] = useState(false)

    useEffect(()=>{
      if(session.status === 'authenticated'){
        router.push('/users');
      
      }
    } , [session.status,router])

    const toggleVariant = useCallback(() => {
      if(variant === 'LOGIN'){
        setVariant('REGISTER')
      }}
    , [variant]);
    const {register,handleSubmit,formState:{
      errors}} = useForm<FieldValues>({
      defaultValues: {
        name: '',
        email: '',
        password: '', 
    }
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)
    if(variant === 'LOGIN'){
      signIn('credentials', {
      ...data, redirect: false
      })
      .then((callback)=>{
        if(callback?.error){
          toast.error('Invalid login credentials!');
        }
        if(callback?.ok && !callback?.error){
          toast.success('Successfully logged in!');
          router.push('/users');
        }
      })
      .finally(()=>setIsLoading(false));
      
    }
    if(variant === 'REGISTER'){
      axios.post('/api/register',data)
      .then(()=>signIn('credentials', data))
      .catch(()=>toast.error('oops Something went wrong!'))
      .finally(()=>setIsLoading(false))
    }
  }

  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, { redirect: false })
    .then((callback)=>{
      if(callback?.error){
        toast.error('Something went wrong!');
      }
      if(callback?.ok && !callback?.error){
        toast.success('Successfully logged in!');
      }
  })
  .finally(()=>setIsLoading(false));
}
  return (
    <div className='mt-8
    sm:mx-auto sm:w-full sm:max-w-md'>
      <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
          <Input id="name"
           label= "Name" required register={register} errors={errors}/>
            )}
          <Input  disabled={isLoading} register={register} errors={errors} required id="email" label='Email address' type="email"/>
          <Input disabled={isLoading}
            register={register}
            errors={errors}
            required
            id="password" 
            label="Password" 
            type="password"/>
          <div>
            <Button
            disabled={isLoading}
            fullWidth
            type="submit">
              {variant === 'LOGIN' ? 'Login' : 'Register'}
              </Button>
          </div>
        </form>

        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'/>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='bg-white px-2 text-sky-500'> Or continue with</span>
              </div>
            </div>
            <div className='mt-6 flex gap-2'>
              <AuthSocialButton 
              icon={BsGithub}
              onClick={() => socialAction('GITHUB')}
              />
              <AuthSocialButton 
              icon={BsGoogle}
              onClick={() => socialAction('GOOGLE')}
              />
            </div>
          </div>
          <div
          className='flex gap-2 justify-center text-sm mt-6 px-2 text-sky-500'>
            <div>
              {variant === 'LOGIN' ? 'Don\'t have an account? ' : 'Already have an account? '}
            </div>
            <div onClick={toggleVariant}
            className='underline cursor-pointer'> {variant === 'LOGIN' ? 'Register' : 'Login'}</div>
          </div>
        </div>
      </div>
  )
}

export default AuthForm