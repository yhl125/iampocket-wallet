import { useMediaQuery } from "react-responsive"
import { useEffect, useState } from "react";

export const usePc=()=>{
  
  const [isPc, setIsPc] = useState(false);
  const pc = useMediaQuery({
      query : "(min-width:768px)"
  });

  useEffect(()=>{
    setIsPc(pc);
  },[pc]);

  return isPc
}

