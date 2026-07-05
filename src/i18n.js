import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "appTitle": "NekoList",
      "contacts": "Contacts",
      "add": "Add",
      "scan": "Scan",
      "noContacts": "No contacts yet.",
      "searchContacts": "Search contacts...",
      "loading": "Loading secure data...",
      "noFound": "No contacts found.",
      "newContact": "New Contact",
      "editContact": "Edit Contact",
      "save": "Save",
      "setAvatar": "Set Avatar (1:1)",
      "nameReq": "Name (Required)",
      "bioOpt": "Bio / Note (Optional)",
      "addresses": "Blockchain Addresses",
      "networkPlaceholder": "Network Name",
      "addressPlaceholder": "Address",
      "addAddress": "Add Address",
      "custom": "Custom...",
      "importPushCard": "Import PushCard",
      "selectImage": "Select Image",
      "processing": "Processing...",
      "scanHint": "Upload a PushCard image from your gallery.\\We will automatically extract the contact info and avatar.",
      "exportPushCard": "Export PushCard",
      "noAddresses": "No addresses",
      "edit": "Edit",
      "deleteConfirm": "Delete this contact?",
      "authReason": "Unlock NekoList",
      "cancel": "Cancel",
      "done": "Done",
      "profile": "Profile",
      "myProfile": "My Profile",
      "setupProfile": "Setup Your Profile",
      "setupProfileDesc": "Create your own crypto address book entry to easily share with others via PushCard.",
      "createProfile": "Create Profile",
      "socialLinks": "Social Media Links",
      "addSocial": "Add Social Link",
      "noSocials": "No social media added.",
      "exchanges": "Exchange Direct Payment",
      "addExchange": "Add Exchange UID",
      "noExchanges": "No exchange UIDs added.",
      "invalidAddress": "Invalid address format for selected network.",
      "about": "About",
      "developerInfo": "Developer Info"
    }
  },
  zh: {
    translation: {
      "appTitle": "NekoList",
      "contacts": "联系人",
      "add": "添加",
      "scan": "扫描导入",
      "noContacts": "暂无联系人。",
      "searchContacts": "搜索联系人...",
      "loading": "正在读取安全数据...",
      "noFound": "未找到联系人。",
      "newContact": "新建联系人",
      "editContact": "编辑联系人",
      "save": "保存",
      "setAvatar": "设置头像 (1:1)",
      "nameReq": "名称 (必填)",
      "bioOpt": "简介 / 备注 (选填)",
      "addresses": "区块链地址",
      "networkPlaceholder": "网络名称",
      "addressPlaceholder": "钱包地址",
      "addAddress": "添加地址",
      "custom": "自定义...",
      "importPushCard": "导入 PushCard",
      "selectImage": "选择图片",
      "processing": "处理中...",
      "scanHint": "从相册上传 PushCard 图片。\\我们将自动提取联系人信息和头像。",
      "exportPushCard": "导出 PushCard",
      "noAddresses": "暂无地址",
      "edit": "编辑",
      "deleteConfirm": "确认删除此联系人？",
      "authReason": "解锁 NekoList",
      "cancel": "取消",
      "done": "完成",
      "profile": "个人资料",
      "myProfile": "我的主页",
      "setupProfile": "设置您的主页",
      "setupProfileDesc": "创建您专属的加密名片，通过 PushCard 与他人轻松分享。",
      "createProfile": "创建主页",
      "socialLinks": "社交媒体链接",
      "addSocial": "添加社交链接",
      "noSocials": "暂无社交媒体。",
      "exchanges": "交易所直付方式",
      "addExchange": "添加交易所 UID",
      "noExchanges": "暂无交易所 UID。",
      "invalidAddress": "所选网络的地址格式不正确。",
      "about": "关于",
      "developerInfo": "开发者信息"
    }
  }
};

const userLang = navigator.language || navigator.userLanguage; 
const defaultLang = userLang.startsWith('zh') ? 'zh' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
