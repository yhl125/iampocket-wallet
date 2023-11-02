import { useMediaQuery } from "react-responsive"

export const usePc=()=>{

  const isPc = useMediaQuery({
      query : "(min-width:768px)"
  });

  return isPc
}

