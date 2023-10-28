import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig, email } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto 100px;
  text-align: center;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    color: var(--green);
    // font-family: var(--font-mono);
    // font-size: var(--fz-md);
    font-size: 40px;// clamp(40px, 5vw, 60px);
    font-weight: 400;

    &:before {
      bottom: 0;
      font-size: var(--fz-sm);
    }

    &:after {
      display: none;
    }
  }

  .title {
    font-size: clamp(40px, 5vw, 60px);
    width: 100%;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      {/* <h2 className="numbered-heading overline">What’s Next?</h2> */}

      <span>  
        <h2 className="title">Ready for Next <span style={{color: 'var(--green)'}}>Collaboration?</span></h2>
      </span>
      

      <p>
      In search of a dedicated software developer? I'm eager to tackle new challenges. Beyond coding, I excel in teamwork and innovation. If you have a job opportunity, don't hesitate. Let's discuss how I can be an asset to your team. Reach out now!
      </p>

      <a className="email-link" href={`mailto:${email}`}>
        Collaborate with me!
      </a>
    </StyledContactSection>
  );
};

export default Contact;
