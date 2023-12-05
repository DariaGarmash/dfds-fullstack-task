import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { type TVoyagePayloadCreate } from '~/pages/api/voyage/create';
import PostVoaygeForm from './PostVoyageForm';

const AddVoyage = () => {
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();
    const mutation = useMutation(
        async (payload: TVoyagePayloadCreate) => {
            const response = await fetch(`/api/voyage/create`, {
                method: "POST",
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to create the voyage");
            }
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(["voyages"]);
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
            <SheetContent>
                <SheetHeader className='mb-2'>
                    <SheetTitle>New voyage</SheetTitle>
                    <SheetDescription>
                        Please fill out the form to crate a new voayge.
                    </SheetDescription>
                </SheetHeader>
                <PostVoaygeForm onSubmit={onSubmit} />
            </SheetContent>
        </Sheet>
    )
}

export default AddVoyage