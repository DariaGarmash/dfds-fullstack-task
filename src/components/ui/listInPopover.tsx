import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import React from 'react'
import { cn } from '~/utils'
import { Button } from './button'

interface Option {
    id: string,
    name: string
}

interface ListInPopoverProps<T extends Option = Option> {
    triggerButtonId: string,
    list: T[],
    generateName: (item: T) => string
}

const ListInPopover = <T extends Option>({ triggerButtonId, list, generateName }: ListInPopoverProps<T>) => {
    const listLength = list.length
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id={triggerButtonId}
                    variant="default"
                    disabled={listLength === 0}
                    className={cn(
                        "justify-center text-center font-normal",
                        listLength === 0 && "text-muted-foreground"
                    )}
                >
                    {listLength}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-primary text-primary-foreground p-2" align="center">
                <ul className="list-circle ml-2">
                    {list.map(item => <li key={item.id}>{generateName(item)}</li>)}
                </ul>
            </PopoverContent>
        </Popover>
    )
}

export default ListInPopover
