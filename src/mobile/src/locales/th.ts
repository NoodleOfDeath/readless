import { enStrings } from './en';

export const thStrings: typeof enStrings = {
  actions: { close: 'ปิด' },
  bookmarks: {
    activity: 'กิจกรรม',
    bookmarks: 'บุ๊กมาร์ก',
    bookmarksDetail: 'บุ๊กมาร์กเสมอพร้อมใช้งานแบบออฟไลน์',
    bookmarksNote: 'หมายเหตุ: บทความต้นฉบับไม่ถูกบันทึกไว้สำหรับการอ่านแบบออฟไลน์',
    removeReadFromBookmarks: 'ลบการอ่านจากบุ๊กมาร์ก',
  },
  browse: 'เรียกดู',
  categories: 'หมวดหมู่',
  category: 'หมวดหมู่',
  channels: 'ช่อง',
  clearSearchHistory: 'ล้างประวัติการค้นหา',
  clearSelection: 'ล้างการเลือก',
  feedback: {
    feedback: 'ข้อเสนอแนะ',
    options: {
      helpful: 'สรุปนี้เป็นประโยชน์จริงๆ',
      imageIrrelevant: 'ภาพนี้ไม่เกี่ยวข้อง',
      imageOffensive: 'ภาพนี้ไม่เหมาะสม',
      inaccurate: 'สิ่งนี้ไม่แม่นยำ',
      incorrectSentiment: 'สรุปนี้มีความรู้สึกผิด',
      notNews: 'สิ่งนี้ไม่ใช่ข่าว',
      offensive: 'สิ่งนี้ไม่เหมาะสม',
      other: 'อื่นๆ',
      spam: 'สิ่งนี้เป็นสแปม',
      tooLong: 'สรุปนี้ยาวเกินไป',
      tooShort: 'สรุปนี้สั้นเกินไป',
      wrongCategory: 'สิ่งนี้อยู่ในหมวดหมู่ผิด',
    },
    sorry: 'ขออภัยในความไม่สะดวก โพสต์นี้จะไม่ปรากฏสำหรับคุณอีกต่อไป',
    submit: 'ส่งข้อเสนอแนะ',
    thankYou: 'ขอบคุณสำหรับข้อเสนอแนะของคุณ!',
  },
  follow: 'ติดตาม',
  followChannel: 'ติดตามช่อง',
  headlines: 'หัวข้อข่าว',
  inTheLast: 'ในช่วง',
  myNews: 'ข่าวของฉัน',
  newsSource: 'แหล่งข่าว',
  readless: 'อ่านน้อยลง', 
  search: {
    customNewsSearch: 'หมายเหตุ: การค้นหานี้เฉพาะในฟีดข่าวที่กำหนดเองของคุณเท่านั้น และไม่รวมทุกบทความข่าว',
    filtersTooSpecific: 'ดูเหมือนว่าตัวกรองของคุณมีรายละเอียดมากเกินไป คุณอาจต้องพิจารณาเพิ่มหมวดหมู่และ/หรือแหล่งข่าวเพิ่มเติมในรายการที่คุณติดตาม',
    goToBrowse: 'ไปที่เรียกดู',
    loadMore: 'โหลดเพิ่มเติม',
    loading: 'กำลังโหลด',
    noResults: 'ไม่พบผลลัพธ์',
    reload: 'โหลดใหม่',
    results: 'ผลลัพธ์',
    search: 'ค้นหา',
  },
  settings: {
    clearCache: 'ล้างแคช',
    clearHistory: 'ล้างประวัติ',
    colorScheme: 'โหมดสี',
    compact: 'ขนาดกะทัดรัด',
    dark: 'มืด',
    defaultReadingMode: 'โหมดอ่านเริ่มต้นเมื่อเปิด',
    displayMode: 'โหมดแสดงผล',
    expanded: 'ขยาย',
    font: 'แบบอักษร',
    light: 'สว่าง',
    resetHiddenSummaries: 'รีเซ็ตสรุปที่ซ่อน',
    resetReadSummaries: 'รีเซ็ตสรุปเป็นยังไม่ได้อ่าน',
    settings: 'การตั้งค่า',
    shortSummaries: 'สรุปสั้นภายใต้หัวข้อ',
    shortSummariesInsteadOfTitles: 'สรุปย่อแทนหัวข้อ',
    system: 'ระบบ',
    textScale: 'มาตราส่วนข้อความ',
  },
  summary: {
    bullets: 'หัวข้อย่อย',
    hide: 'ซ่อน',
    markAsRead: 'ทำเครื่องหมายว่าอ่านแล้ว',
    markAsUnRead: 'ทำเครื่องหมายว่ายังไม่อ่าน',
    negative: 'ลบ',
    neutral: 'เป็นกลาง',
    positive: 'บวก',
    reportAtBug: 'รายงานข้อบกพร่อง',
    sentimentAnalysis: 'การวิเคราะห์อารมณ์',
    sentimentAnalysisInfo: 'การวิเคราะห์อารมณ์เป็นเครื่องมือที่ช่วยให้เรารู้ว่าคนรู้สึกอย่างไรต่อสิ่งใด ๆ โดยการวิเคราะห์ภาษาของพวกเขา เครื่องมือนี้สำรวจคำที่ผู้คนใช้และตัดสินใจว่าเป็นคำที่เชิงบวก เชิงลบ หรือกลาง สิ่งนี้สามารถมีประโยชน์ในหลายๆ ด้าน เช่น เข้าใจความคิดเห็นของลูกค้าหรือความเห็นของประชาชนเกี่ยวกับเรื่องใดเรื่องหนึ่ง',
    showOriginalText: 'แสดงข้อความเดิม',
    showTranslatedText: 'แสดงข้อความแปล',
    summary: 'สรุป',
    summaryBullets: 'สรุป/หัวข้อย่อย',
    thisIsNotARealImage: 'ภาพนี้ถูกสร้างขึ้นโดยใช้ปัญญาประดิษฐ์และไม่ใช่ภาพถ่ายจริงของเหตุการณ์ สถานที่ สิ่งของ หรือบุคคลจริง',
    translate: 'แปล',
    veryNegative: 'เชิงลบมาก',
    veryPositive: 'เชิงบวกมาก',
  },
  unfollow: 'ยกเลิกติดตาม',
  unfollowChannel: 'ยกเลิกติดตามช่อง',
};
