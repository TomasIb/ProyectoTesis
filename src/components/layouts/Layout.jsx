import React from 'react';
import {styles} from './styles';
import { Container } from '@material-ui/core';

export default function Layout(ComponentToProtect) {
  return class extends React.Component {    
    render() {
        return (          
          <React.Fragment>                 
              <Container maxWidth="xl" className={styles.root}>
                <ComponentToProtect  {...this.props} />              
              </Container>            
          </React.Fragment>
        ); 
    }
  }
}