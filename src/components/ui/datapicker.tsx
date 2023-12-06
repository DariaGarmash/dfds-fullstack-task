"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { cn } from "~/utils"
import { Button } from "src/components/ui/button"
import { Calendar, type CalendarProps } from "src/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "src/components/ui/popover"
import { DATE_PICKER_FORMAT } from "~/constants"

type TDateTimePickerSingleProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'hidden'> & CalendarProps & {
    value?: Date,
    onChange: (date?: Date) => void
}

const DatePickerSingle: React.FC<TDateTimePickerSingleProps> = React.forwardRef(
    ({ className, value, onChange, ...props }: TDateTimePickerSingleProps, ref) => {
        const [date, setDate] = React.useState<Date | undefined>(new Date())

        React.useEffect(() => {
            setDate(value)
        }, [value])

        const onSelect = (selectedDate?: Date) => {
            setDate(selectedDate)
            onChange(selectedDate)
        }

        return (
            <div className={cn("grid gap-2", className)}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-[300px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ?
                                format(date, DATE_PICKER_FORMAT)
                                : <span>Pick a date and time</span>
                            }
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            {...props}
                            initialFocus
                            mode="single"
                            defaultMonth={date ?? new Date()}
                            selected={date}
                            onSelect={onSelect}
                            numberOfMonths={1}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        )
    })

DatePickerSingle.displayName = 'DatePickerSingle'

export default DatePickerSingle
