import React, { memo, useMemo } from "react";

import ArrowRight from "../../assets/icons/arrow-right.svg";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import MenuIcon from "@/assets/icons/MenuIcon.svg";
import Notification from "@/assets/icons/notifications.svg";
import BGLogo from "@/assets/icons/bg-logo.svg";
import Search from "@/assets/icons/search.svg";
import Home from "@/assets/icons/home.svg";
import Close from "@/assets/icons/close.svg";
import Products from "@/assets/icons/products.svg";
import KeyboardArrowUp from "@/assets/icons/keyboard_arrow_up.svg";
import KeyboardArrowRight from "@/assets/icons/keyboard_arrow_right.svg";
import Expand from "@/assets/icons/expand.svg";
import Info from "@/assets/icons/info.svg";
import Add from "@/assets/icons/add.svg";
import ImportFile from "@/assets/icons/import-file.svg";
import DownloadFile from "@/assets/icons/download.svg";
import User from "@/assets/icons/user-icon.svg";
import Orders from "@/assets/icons/orders.svg";
import Car from "@/assets/icons/car.svg";
import Calendar from "@/assets/icons/calendar.svg";
import Remove from "@/assets/icons/remove.svg";
import Check from "@/assets/icons/check.svg";
import General from '@/assets/icons/general.svg';
import SKU from '@/assets/icons/sku.svg';
import Warehouse from "@/assets/icons/warehouse.svg";
import Additional from '@/assets/icons/additional.svg';
import Dimensions from "@/assets/icons/dimensions.svg";
import Barcodes from '@/assets/icons/barcodes.svg';
import UnderConstruction from "@/assets/icons/under-construction.svg";
import Aliases from '@/assets/icons/aliases.svg';
import SuccessIcon from '@/assets/icons/success-icon.svg';
import ErrorIcon from '@/assets/icons/error-icon.svg';
import CloseInCircle from '@/assets/icons/close-in-circle.svg'
import Upload from '@/assets/icons/upload.svg'
import Bundle from '@/assets/icons/bundle.svg'
import History from '@/assets/icons/history.svg'
import Analogues from '@/assets/icons/analogues.svg'
import Files from '@/assets/icons/files.svg'
import Delete from '@/assets/icons/delete.svg'
import Goods from '@/assets/icons/goods.svg'
import Receiver from '@/assets/icons/receiver.svg'
import Filter from '@/assets/icons/filter.svg'
import Exit from '@/assets/icons/exit.svg'
import AddTableRow from '@/assets/icons/add-table-row.svg'
import RemoveTableRow from '@/assets/icons/remove-table-row.svg'


export const icons = {
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "menu-icon": MenuIcon,
  notification: Notification,
  "bg-logo": BGLogo,
  "search": Search,
  "home": Home,
  "close": Close,
  "products": Products,
  "keyboard-arrow-up": KeyboardArrowUp,
  "keyboard-arrow-right": KeyboardArrowRight,
  'expand': Expand,
  'info': Info,
  'add': Add,
  'import-file': ImportFile,
  'download-file': DownloadFile,
  'user': User,
  'orders': Orders,
  'car': Car,
  'calendar': Calendar,
  'remove': Remove,
  'check': Check,
  'general': General,
  'sku': SKU,
  'warehouse': Warehouse,
  'additional': Additional,
  'dimensions': Dimensions,
  'barcodes': Barcodes,
  'under-construction': UnderConstruction,
  'aliases': Aliases,
  'success': SuccessIcon,
  'error': ErrorIcon,
  'close-in-circle': CloseInCircle,
  'upload': Upload,
  'bundle': Bundle,
  'history': History,
  'analogues': Analogues,
  'files': Files,
  'delete': Delete,
  'goods': Goods,
  'receiver': Receiver,
  'filter': Filter,
  'exit': Exit,
  'add-table-row': AddTableRow,
  'remove-table-row': RemoveTableRow,
};

export type IconType = keyof typeof icons;

export type IconProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  name: IconType;
  className?: string;
};

export const Icon: React.FC<IconProps> = memo(({ name = "arrow-left", className="" }) => {
  const IconComponent = useMemo(() => icons[name], [name]);

  return <IconComponent className={className}/>;
});

Icon.displayName = "Icon";

export default Icon;
