export interface AttributeTableItem {
  attribute: string;
  value: string;
  description: string;
}

export interface TutorialSubSection {
  title: string;
  theory: string[];
  syntax?: string;
  table?: AttributeTableItem[];
  tips?: string[];
  codeExample?: string;
  browserOutputDesc?: string;
}

export interface RichTutorialChapter {
  id: string;
  chapterNumber: number;
  title: string;
  category: string;
  shortDesc: string;
  overview: string[];
  sections: TutorialSubSection[];
}

export interface W3TopicItem {
  id: string;
  name: string;
  isHeader?: boolean;
  hasArrow?: boolean;
  chapterRefId: string;
}
