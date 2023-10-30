import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledProjectsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .projects-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
    position: relative;
    margin-top: 50px;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }
`;

const StyledProject = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);
  height: 18.5rem;

  @media (max-width: 992px) {
    height: 12rem;
  }

  @media (max-width: 480px) {
    height: 14rem;
  }

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .project-inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    overflow: hidden;
    
    header {
      padding: 1rem 2rem 1rem 2rem;
      @media (max-width: 992px) {
        width: 100%;
      }
    }
    footer {
      padding: 0rem 0.5rem 1rem 1rem;
    }
  }

  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    height: 3rem;  
    margin-top 1rem;
    margin-bottom: 1rem;

    @media (max-width: 992px) {
      margin-bottom: 0rem;
    }
    @media (max-width: 480px) {
      margin-bottom: 0.25rem;
    }

    .folder-group {
      width: 100%;
      display: flex;
      align-items: center;
  
      .folder {
        position: relative;
        left: 0.1rem;
        top -0.75rem;
        width: 1.75rem;
        height: 1.75rem;
                
        @media (min-width: 576px) and (max-width: 1080px) {
          width: 2.5rem;
          height: 2.5rem;
        }

        color: var(--green);
        svg {
          width: 100%;
          height: 100%;
        }
      }

      .project-title {
        margin-left: 0.75rem;
        width: 80%;
        
        color: var(--lightest-slate);
        font-size: var(--fz-xl);
        a {
          position: static;
    
          &:before {
            content: '';
            display: block;
            position: absolute;
            z-index: 0;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
          }
        }
        @media (max-width: 1200px) {
          width: 80%;
          font-size: var(--fz-l);
        }
        @media (max-width: 1080px) {
          font-size: var(--fz-xxl);
          width: 80%;
        }
        @media (max-width: 576px) and (max-width: 992px) { 
          width: 70%;
          font-size: var(--fz-xxl);
      }
      }
    }
    
    .project-links {
      position: absolute;
      right: 1rem;
      top: 1rem;
      color: var(--light-slate);

      a {
        ${({ theme }) => theme.mixins.flexCenter};
        width: 2rem;
        height: 2rem;

        &.external {
          svg {
            width: 1rem;
            height: 1rem;
            margin-top: -0.9rem;
          }
        }

        svg {
          width: 1rem;
          height: 1rem;
        }
      }
    }
  }


  .project-description {
    color: var(--light-slate);
    font-size: 1.1rem;
    overflow: hidden;          
    text-overflow: ellipsis;   
    max-width: 90%;            
    height: 8rem;
    
    @media (max-width: 992px) {
      height: 4rem;
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .project-tech-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    width: 100%;
    // margin: 30px 0 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
`;

function truncate(source, size) {
  return source.length > size ? source.slice(0, size - 1) + "…" : source;
}


const Projects = () => {
  const data = useStaticQuery(graphql`
    query {
      projects: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/projects/" }
          frontmatter: { showInProjects: { ne: false } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              tech
              github
              external
            }
            html
          }
        }
      }
    }
  `);

  const [showMore, setShowMore] = useState(false);
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 6;
  const projects = data.projects.edges.filter(({ node }) => node);
  const firstSix = projects.slice(0, GRID_LIMIT);
  const projectsToShow = showMore ? projects : firstSix;

  const projectInner = node => {
    const { frontmatter, html } = node;
    const { github, external, title, tech } = frontmatter;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const textContent = doc.body.textContent || "";
    const maxContentSize = 128;
    const truncatedContent = truncate(textContent, maxContentSize);

    return (
      <div className="project-inner">
        <header>
          <div className="project-top">
            <div className='folder-group'>
              <div className="folder">
                <Icon name="Folder" />
              </div>
              <h3 className="project-title">
                {external ? (
                  <a href={external} target="_blank" rel="noreferrer">
                    {title}
                  </a>
                ) : github ? (
                  <a href={github} target="_blank" rel="noreferrer">
                    {title}
                  </a>
                ) : (
                  <p>{title}</p>
                )}
              </h3>
            </div>
            <div className="project-links">
              {github && (
                <a href={github} aria-label="GitHub Link" target="_blank" rel="noreferrer">
                  <Icon name="GitHub" />
                </a>
              )}
              {external && (
                <a
                  href={external}
                  aria-label="External Link"
                  className="external"
                  target="_blank"
                  rel="noreferrer">
                  <Icon name="External" />
                </a>
              )}
            </div>
          </div>

          <div className="project-description" dangerouslySetInnerHTML={{ __html: truncatedContent }} />
        </header>

        <footer>
          {tech && (
            <ul className="project-tech-list">
              {tech.map((tech, i) => (
                <li key={i}>{tech}</li>
              ))}
            </ul>
          )}
        </footer>
      </div>
    );
  };

  return (
    <section id="projects">
      <StyledProjectsSection>
        <h2 ref={revealTitle} className='centered-numbered-heading'> Featured Projects</h2>

        <ul className="projects-grid">
          {prefersReducedMotion ? (
            <>
              {projectsToShow &&
                projectsToShow.map(({ node }, i) => (
                  <StyledProject key={i}>{projectInner(node)}</StyledProject>
                ))}
            </>
          ) : (
            <TransitionGroup component={null}>
              {projectsToShow &&
                projectsToShow.map(({ node }, i) => (
                  <CSSTransition
                    key={i}
                    classNames="fadeup"
                    timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                    exit={false}>
                    <StyledProject
                      key={i}
                      ref={el => (revealProjects.current[i] = el)}
                      style={{
                        transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                      }}>
                      {projectInner(node)}
                    </StyledProject>
                  </CSSTransition>
                ))}
            </TransitionGroup>
          )}
        </ul>

        {/* <button className="more-button" onClick={() => setShowMore(!showMore)}>
          Show {showMore ? 'Less' : 'More'}
        </button> */}
      </StyledProjectsSection>
    </section>
    
  );
};

export default Projects;
