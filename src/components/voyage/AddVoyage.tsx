import React, { type FormEvent, useState } from 'react'
import { type VoyagePayloadCreate } from '~/pages/api/voyage/create'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'

interface AddVoyageProps {
    onCreate: (data: VoyagePayloadCreate) => void
}

const AddVoyage: React.FC<AddVoyageProps> = ({ onCreate }) => {
    const [open, setOpen] = useState(false);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('onSubmit form', e)
        setOpen(!open)

        onCreate({
            portOfLoading: 'portOfLoading',
            portOfDischarge: 'portOfDischarge',
            vesselId: 'clpqok4eq00015lugd16ddxmn',
            scheduledDeparture: new Date(),
            scheduledArrival: new Date()
        })
    }
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="default" onClick={() => setOpen(!open)}>Add</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>New voyage</SheetTitle>
                    <SheetDescription>
                        Please fill out the form to crate a new voayge.
                    </SheetDescription>
                </SheetHeader>
                <form action="post" onSubmit={onSubmit}>
                    <label htmlFor="portOfLoading"></label>
                    <input type="text" id='portOfLoading' />
                    <Button variant="default" type='submit'>Save & close</Button>
                </form>
            </SheetContent>
        </Sheet>
    )
}

export default AddVoyage