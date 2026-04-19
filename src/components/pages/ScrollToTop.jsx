import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // أول ما الـ pathname يتغير، اطلع فوق خالص
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // الـ Component ده مش بيرندر حاجة في الـ UI
};

export default ScrollToTop;