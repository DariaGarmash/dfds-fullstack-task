import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { type TVoyagePayloadCreate } from '~/pages/api/voyage/create';
import PostVoaygeForm from './PostVoyageForm';
import { toast } from '../ui/use-toast';
import { cn } from '~/utils';
import { createVoyage } from '~/mutateFunctions/voyage';

const AddVoyage = () => {
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();
    const mutation = useMutation(
        async (payload: TVoyagePayloadCreate) => createVoyage(payload),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(["voyages"]);
                toast({
                    description: "A new voyage has beed added successfully",
                    variant: 'success'
                });
            },
        }
    );

    const onSubmit = (data: TVoyagePayloadCreate) => {
        mutation.mutate(data)
        setOpen(false)
    }
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="default" onClick={() => setOpen(!open)}>Add</Button>
            </SheetTrigger>
            <SheetContent className="w-[600px]">
                <SheetHeader className='mb-2'>
                    <SheetTitle>New voyage</SheetTitle>
                    <SheetDescription>
                        Please fill out the form to crate a new voayge.
                    </SheetDescription>
                </SheetHeader>
                <section className={cn(`overflow-y-auto h-[85vh]`)}>
                    <PostVoaygeForm onSubmit={onSubmit} />
                </section>
            </SheetContent>
        </Sheet>
    )
}

export default AddVoyage