import React from 'react';
import { Oval } from 'react-loader-spinner';
import styled from 'styled-components';

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Adjust the height as needed */
`;

const IconLoader = ({ icon_color='#4fa94d' }) => (
  <LoaderWrapper>
    <Oval
    height={300}
    width={300}
    color={icon_color}
    wrapperStyle={{}}
    wrapperClass=""
    visible={true}
    ariaLabel='oval-loading'
    secondaryColor={icon_color}
    strokeWidth={1}
    strokeWidthSecondary={1}
  />
  </LoaderWrapper>
);

export default IconLoader;
