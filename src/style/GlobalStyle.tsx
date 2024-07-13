import { createGlobalStyle } from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PretendardRegularWoff2 from '@/assets/fonts/woff2-subset/Pretendard-Regular.subset.woff2';
import PretendardRegularWoff from '@/assets/fonts/woff-subset/Pretendard-Regular.subset.woff';
import PretendardRegularOtf from '@/assets/fonts/otf/Pretendard-Regular.otf';
import PretendardMediumWoff2 from '@/assets/fonts/woff2-subset/Pretendard-Medium.subset.woff2';
import PretendardMediumWoff from '@/assets/fonts/woff-subset/Pretendard-Medium.subset.woff';
import PretendardMediumOtf from '@/assets/fonts/otf/Pretendard-Medium.otf';
import PretendardSemiBoldWoff2 from '@/assets/fonts/woff2-subset/Pretendard-SemiBold.subset.woff2';
import PretendardSemiBoldWoff from '@/assets/fonts/woff-subset/Pretendard-SemiBold.subset.woff';
import PretendardSemiBoldOtf from '@/assets/fonts/otf/Pretendard-SemiBold.otf';
import PretendardBoldWoff2 from '@/assets/fonts/woff2-subset/Pretendard-Bold.subset.woff2';
import PretendardBoldWoff from '@/assets/fonts/woff-subset/Pretendard-Bold.subset.woff';
import PretendardBoldOtf from '@/assets/fonts/otf/Pretendard-Bold.otf';
import PretendardExtraBoldWoff2 from '@/assets/fonts/woff2-subset/Pretendard-ExtraBold.subset.woff2';
import PretendardExtraBoldWoff from '@/assets/fonts/woff-subset/Pretendard-ExtraBold.subset.woff';
import PretendardExtraBoldOtf from '@/assets/fonts/otf/Pretendard-ExtraBold.otf';

const GlobalStyle = createGlobalStyle`
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/
/* reset css */
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: flex;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}

/* button 초기화 */
button {
   background: none;
   color: inherit;
   border: none;
   padding: 0;
   font: inherit;
   cursor: pointer;
   outline: inherit;
}

/* font 설정 */
@font-face {
	font-family: 'Pretendard';
  font-weight: 400;
	src: local('Pretendard-Regular'), 
  url(${PretendardRegularWoff2}) format('woff2'), 
  url(${PretendardRegularWoff}) format('woff'), 
  url(${PretendardRegularOtf}) format('otf'),
}
@font-face {
	font-family: 'Pretendard';
  font-weight: 500;
	src: local('Pretendard-Medium'), 
  url(${PretendardMediumWoff2}) format('woff2'), 
  url(${PretendardMediumWoff}) format('woff'), 
  url(${PretendardMediumOtf}) format('otf'),
}
@font-face {
	font-family: 'Pretendard';
  font-weight: 600;
	src: local('Pretendard-SemiBold'), 
  url(${PretendardSemiBoldWoff2}) format('woff2'), 
  url(${PretendardSemiBoldWoff}) format('woff'), 
  url(${PretendardSemiBoldOtf}) format('otf'),
}
@font-face {
	font-family: 'Pretendard';
  font-weight: 700;
	src: local('Pretendard-Bold'), 
  url(${PretendardBoldWoff2}) format('woff2'), 
  url(${PretendardBoldWoff}) format('woff'), 
  url(${PretendardBoldOtf}) format('otf'),
}
@font-face {
	font-family: 'Pretendard';
  font-weight: 800;
	src: local('Pretendard-ExtraBold'), 
  url(${PretendardExtraBoldWoff2}) format('woff2'), 
  url(${PretendardExtraBoldWoff}) format('woff'), 
  url(${PretendardExtraBoldOtf}) format('otf'),
}

* {
	font-family: 'Pretendard';
}

/* 레이아웃 설정 */
html, body, div#root {
  display: flex;
  width: 100%;
  height: 100%;
}
div#root {
  flex-direction: column;
}

/* input placeholder 색상 */
input::placeholder {
  color: #ababab;
}

/* 텍스트 오버플로우 생략 */
.hideTextOverflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* a 링크 색깔 초기화 */
a { 
  color: inherit; 
  text-decoration: none;
} 

/* animation 설정 */

@keyframes animloader {
  0% {
    box-shadow:
      -38px -12px,
      -14px 0,
      14px 0,
      38px 0;
  }
  33% {
    box-shadow:
      -38px 0px,
      -14px -12px,
      14px 0,
      38px 0;
  }
  66% {
    box-shadow:
      -38px 0px,
      -14px 0,
      14px -12px,
      38px 0;
  }
  100% {
    box-shadow:
      -38px 0,
      -14px 0,
      14px 0,
      38px -12px;
  }
}

@keyframes fontColorChanger {
  0% {
    color: black;
  }
  33% {
    color: #333;
  }
  66% {
    color: #23c;
  }
  100% {
    color: black;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes prixClipFix {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
  }
  25% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
  }
  75% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
  }
  100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
  }
}

@keyframes shake-lr {
  0%,
  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
  }
  20% {
    -webkit-transform: rotate(5deg);
    transform: rotate(5deg);
  }
  40%,
  80% {
    -webkit-transform: rotate(-7deg);
    transform: rotate(-7deg);
  }
  60% {
    -webkit-transform: rotate(7deg);
    transform: rotate(7deg);
  }
}
`;

export default GlobalStyle;
