import { FunctionComponent } from 'react';

import HomePageTemplate from '@/components/templates/home';

const HomePage: FunctionComponent<THomePageProps> = async () => {
  return (
    <div>
      <HomePageTemplate />
    </div>
  );
};

type THomePageProps = {};

export default HomePage;
