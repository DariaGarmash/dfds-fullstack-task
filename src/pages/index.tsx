import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Head from "next/head";
import Layout from "~/components/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn, fetchData } from "~/utils";
import type { ReturnType } from "./api/voyage/getAll";
import { Button } from "~/components/ui/button";
import { TABLE_DATE_FORMAT } from "~/constants";
import AddVoyage from "~/components/voyage/AddVoyage";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { deleteVoayage } from "~/mutateFunctions/voyage";

export default function Home() {
  const allVoyagesQueryKey = "voyages"
  const { data: voyages } = useQuery<ReturnType>([allVoyagesQueryKey], () =>
    fetchData("voyage/getAll")
  );

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (voyageId: string) => deleteVoayage(voyageId),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([allVoyagesQueryKey]);
      },
    }
  );

  const handleDelete = (voyageId: string) => {
    mutation.mutate(voyageId);
  };

  return (
    <>
      <Head>
        <title>Voyages | DFDS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section className="w-full py-4">
          <AddVoyage />
        </section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Port of loading</TableHead>
              <TableHead>Port of discharge</TableHead>
              <TableHead>Vessel</TableHead>
              <TableHead>Unit Types</TableHead>
              <TableHead>&nbsp;</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voyages?.map((voyage) => (
              <TableRow key={voyage.id}>
                <TableCell>
                  {format(
                    new Date(voyage.scheduledDeparture),
                    TABLE_DATE_FORMAT
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(voyage.scheduledArrival), TABLE_DATE_FORMAT)}
                </TableCell>
                <TableCell>{voyage.portOfLoading}</TableCell>
                <TableCell>{voyage.portOfDischarge}</TableCell>
                <TableCell>{voyage.vessel.name}</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id={voyage.id}
                        variant="default"
                        disabled={voyage.unitTypes.length === 0}
                        className={cn(
                          "justify-center text-center font-normal",
                          voyage.unitTypes.length === 0 && "text-muted-foreground"
                        )}
                      >
                        {voyage.unitTypes.length}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-primary text-primary-foreground p-2" align="center">
                      <ul className="list-circle">
                        {voyage.unitTypes.map(unit => <li key={unit.id}>{unit.name} (length: {unit.defaultLength})</li>)}
                      </ul>
                    </PopoverContent>
                  </Popover></TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDelete(voyage.id)}
                    variant="outline"
                  >
                    X
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Layout>
    </>
  );
}
