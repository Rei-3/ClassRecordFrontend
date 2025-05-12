import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/cards/card";
import Link from "next/link";
import IconBook from "@/components/icon/icon-book";
import TeachingLoadsComponent from "@/components/teachingLoad/teachingLoadComponent"; 
import { fetchTeachingLoads } from "@/lib/api/teachingLoadApi";
import { TeachingLoad } from "@/store/api/types/teachingLoadTypes";

import TeachingLoadSectionsTable from "@/components/teachingLoad/datatables/components-datatables-order-sorting";

export default async function TeachingLoadsPage() {
  
 return (
  <div>
  
    <div>
    <TeachingLoadsComponent />
    {/* <TeachingLoadCardsComponent/> */}
    </div>
    <div>
      
      <TeachingLoadSectionsTable/>
    </div>
  </div>
 );
}
