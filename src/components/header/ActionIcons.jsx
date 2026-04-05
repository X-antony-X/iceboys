import { FiUser, FiHeart, FiShoppingBag } from 'react-icons/fi';

const ActionIcons = () => {
  const iconStyle = "text-[#2d2d2d] text-2xl cursor-pointer hover:text-[#004b93] transition-colors p-1";
  
  return (
    <div className="flex items-center gap-1 sm:gap-4">
      {/* اليوزر يختفي في الشاشات الصغيرة جداً ويظهر من أول sm */}
      <FiUser className={`${iconStyle} hidden sm:block`} />
      
      {/* القلب يظهر فقط في الشاشات المتوسطة وما فوق */}
      <FiHeart className={`${iconStyle} hidden md:block`} />
      
      {/* الشنطة أساسية في كل الشاشات */}
      <div className="relative">
        <FiShoppingBag className={iconStyle} />
        <span className="absolute -top-1 -right-1 bg-[#004b93] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
          0
        </span>
      </div>
    </div>
  );
};

export default ActionIcons;