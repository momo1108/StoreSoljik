import { ClassName } from '@/types/GlobalType';
import * as S from './NavBar.Style';
import { Link } from 'react-router-dom';
import { checkPathIsActive } from '@/utils/utils';

type NavType = {
  name: string;
  path: string;
};

type NavBarProps = ClassName & {
  navData: NavType[];
};

const NavBar: React.FC<NavBarProps> = ({ className = '', navData = [] }) => {
  return (
    <S.NavContainer className={className}>
      {navData.map((nav) => {
        return (
          <li key={`routeTo${nav.name}`}>
            <Link
              className={checkPathIsActive(nav.path) ? 'active' : ''}
              to={nav.path}
            >
              {nav.name}
            </Link>
          </li>
        );
      })}
    </S.NavContainer>
  );
};

export default NavBar;
