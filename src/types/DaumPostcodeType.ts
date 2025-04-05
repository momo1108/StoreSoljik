declare global {
  interface Window {
    daum: IDaum;
  }
}

interface IDaum {
  Postcode: new (options: {
    oncomplete: (data: DaumPostcodeResult) => void;
  }) => { open: () => void };
}

export type DaumPostcodeResult = {
  postcode: string;
  postcode1: string;
  postcode2: string;
  postcodeSeq: string;
  zonecode: string;
  address: string;
  addressEnglish: string;
  addressType: 'R' | 'J';
  apartment: 'Y' | 'N';
  bcode: string;
  bname: string;
  bnameEnglish: string;
  bname1: string;
  bname1English: string;
  bname2: string;
  bname2English: string;
  sido: string;
  sidoEnglish: string;
  sigungu: string;
  sigunguEnglish: string;
  sigunguCode: string;
  query: string;
  buildingName: string;
  buildingCode: string;
  jibunAddress: string;
  jibunAddressEnglish: string;
  roadAddress: string;
  roadAddressEnglish: string;
  autoRoadAddress: string;
  autoRoadAddressEnglish: string;
  autoJibunAddress: string;
  autoJibunAddressEnglish: string;
  userLanguageType: 'K' | 'E';
  userSelectedType: 'R' | 'J';
  noSelected: 'Y' | 'N';
  hname: string;
  roadnameCode: string;
  roadname: string;
  roadnameEnglish: string;
};
