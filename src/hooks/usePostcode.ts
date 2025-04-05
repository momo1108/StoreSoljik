import { useEffect, useState } from 'react';
import { loadScript } from '@/utils/utils';
import { toast } from 'sonner';
import { DaumPostcodeResult } from '@/types/DaumPostcodeType';

type OpenPostcodeSearch = (
  onSelect: (data: DaumPostcodeResult) => void,
) => void;

const usePostcode = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  useEffect(() => {
    toast.promise(
      loadScript(
        'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js',
        'KakaoPostcodeApi',
      ),
      {
        loading: 'Daum 우편번호 기능을 불러오는 중입니다.',
        success: () => {
          setScriptLoaded(true);
          return 'Daum 우편번호 기능을 불러왔습니다. "우편번호 찾기" 버튼을 클릭해 주소를 검색할 수 있습니다.';
        },
        error:
          'Daum 우편번호 기능을 불러오는데 실패했습니다. 직접 입력하시거나 "새로고침"을 통해 다시 페이지를 로딩해주세요.',
      },
    );
  }, []);

  const openPostcodeSearch: OpenPostcodeSearch = (onSelect = () => {}) => {
    if (!scriptLoaded) {
      toast.error('아직 Daum 우편번호 기능을 불러오지 못했습니다.');
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        // Handle the selected address data
        onSelect(data);
      },
    }).open();
  };

  return { openPostcodeSearch };
};

export default usePostcode;
