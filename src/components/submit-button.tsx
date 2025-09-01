'use client';

import clsx from 'clsx';
import { LucideLoaderCircle } from 'lucide-react';
import { cloneElement } from 'react';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';

type SubmitButtonProps = {
  label?: string;
  icon?: React.ReactElement;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
};

const SubmitButton = ({
  label,
  icon,
  variant = 'default',
  size = 'default',
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      variant={variant}
      size={size}
      className="bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-500 focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {pending && (
        <LucideLoaderCircle
          className={clsx('h-4 w-4 animate-spin', {
            'mr-2': !!label,
          })}
        />
      )}
      {pending ? 'Booking Appointment' : label}
    </Button>
  );
};

export { SubmitButton };
