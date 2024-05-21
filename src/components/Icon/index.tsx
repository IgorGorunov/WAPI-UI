import React, { memo, useMemo } from "react";

import ArrowRight from "../../assets/icons/arrow-right.svg";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import MenuIcon from "@/assets/icons/MenuIcon.svg";
import Notification from "@/assets/icons/notification.svg";
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
import History2 from '@/assets/icons/history2.svg'
import Analogues from '@/assets/icons/analogues.svg'
import Files from '@/assets/icons/files.svg'
import Delete from '@/assets/icons/delete.svg'
import Goods from '@/assets/icons/goods.svg'
import Receiver from '@/assets/icons/receiver.svg'
import Filter from '@/assets/icons/filter.svg'
import Exit from '@/assets/icons/exit.svg'
import AddTableRow from '@/assets/icons/add-table-row.svg'
import RemoveTableRow from '@/assets/icons/remove-table-row.svg'
import Finances from '@/assets/icons/finances.svg'
import Mastercard from '@/assets/icons/mastercard.svg'
import Visa from '@/assets/icons/visa.svg'
import Paypal from '@/assets/icons/paypal.svg'
import Message from '@/assets/icons/message.svg'
import StockMovement from '@/assets/icons/stock-movements.svg'
import Plus from '@/assets/icons/plus.svg'
import Minus from '@/assets/icons/minus.svg'
import SortAsc from '@/assets/icons/sort_asc.svg'
import SortDesc from '@/assets/icons/sort_desc.svg'
import ShoppingCart from '@/assets/icons/shopping_cart.svg'
import Track from '@/assets/icons/track_changes.svg'
import Complaint from '@/assets/icons/complaint.svg'
import Trouble from '@/assets/icons/trouble.svg'
import Burger from '@/assets/icons/burger.svg'
import WasteBin from "@/assets/icons/waste-bin.svg"
import Clear from '@/assets/icons/clear.svg'
import TrendingUp from '@/assets/icons/trending_up.svg'
import ReportFolder from '@/assets/icons/reports-folder.svg'
import ArrowUpGreen from '@/assets/icons/arrow-up-green.svg'
import ArrowDownRed from '@/assets/icons/arrow-down-red.svg'
import Question from '@/assets/icons/question.svg'
import Copy from '@/assets/icons/copy.svg'
import Selection from '@/assets/icons/selection.svg'
import Select from '@/assets/icons/select.svg'
import Send from '@/assets/icons/send.svg'
import BigCheck from '@/assets/icons/big-check.svg'
import PreviewFile from '@/assets/icons/preview.svg'
import File from '@/assets/icons/file.svg'
import Options from '@/assets/icons/options.svg'
import Ticket  from '@/assets/icons/ticket.svg'
import Emoji from '@/assets/icons/emoji.svg'
import Book from '@/assets/icons/book.svg'
import Edit from '@/assets/icons/edit.svg'
import ApiDocumentation from '@/assets/icons/api-documentation.svg'
import Profile from '@/assets/icons/profile.svg'
import Folder from '@/assets/icons/folder.svg'
import Analytics from '@/assets/icons/analytics.svg'
import FinTransparency from '@/assets/icons/fin-transparency.svg'
import GalaSettings from '@/assets/icons/gala_settings.svg'
import OutlineClock from '@/assets/icons/clock-outline.svg'
import OutlineShopping from '@/assets/icons/outline_shopping.svg'
import Lines from '@/assets/icons/lines.svg'
import Admin from '@/assets/icons/admin.svg'
import Settings from '@/assets/icons/settings.svg'

export const icons = {
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "menu-icon": MenuIcon,
  'notification': Notification,
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
  'history2': History2,
  'analogues': Analogues,
  'files': Files,
  'delete': Delete,
  'goods': Goods,
  'receiver': Receiver,
  'filter': Filter,
  'exit': Exit,
  'add-table-row': AddTableRow,
  'remove-table-row': RemoveTableRow,
  'finances': Finances,
  'mastercard': Mastercard,
  'visa': Visa,
  'paypal': Paypal,
  'message': Message,
  'stock-movement': StockMovement,
  'plus': Plus,
  'minus': Minus,
  'sort-asc': SortAsc,
  'sort-desc': SortDesc,
  'shopping-cart': ShoppingCart,
  'track': Track,
  'complaint': Complaint,
  'trouble': Trouble,
  'burger': Burger,
  'waste-bin': WasteBin,
  'clear': Clear,
  'trending-up': TrendingUp,
  'reports-folder': ReportFolder,
  'arrow-up-green': ArrowUpGreen,
  'arrow-down-red': ArrowDownRed,
  'question': Question,
  'copy': Copy,
  'selection': Selection,
  'select': Select,
  'send': Send,
  'big-check': BigCheck,
  'preview': PreviewFile,
  'file': File,
  'options': Options,
  'ticket': Ticket,
  'emoji': Emoji,
  'book': Book,
  'edit': Edit,
  'api-documentation': ApiDocumentation,
  'profile': Profile,
  'folder': Folder,
  'analytics': Analytics,
  'fin-transparency': FinTransparency,
  'gala-settings': GalaSettings,
  'shopping-outline': OutlineShopping,
  'clock': OutlineClock,
  'lines': Lines,
  'admin': Admin,
  'settings': Settings,
};

export type IconType = keyof typeof icons;

export type IconProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  name: IconType;
  className?: string;
};

export const Icon: React.FC<IconProps> = memo(({ name = "arrow-left", className="" }) => {
  const IconComponent = useMemo(() => icons[name], [name]);

  return <IconComponent className={`icon icon-${name} ${className}`}/>;
});

Icon.displayName = "Icon";

export default Icon;
