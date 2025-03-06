import React from 'react';
import { Container, Card, Input, Button } from '../components/common/StyledComponents';

const Login: React.FC = () => {
  return (
    <Container>
      <Card>
        <h2>Login</h2>
        <form>
          <Input 
            type="email" 
            placeholder="Email"
            style={{ marginBottom: '1rem' }}
          />
          <Input 
            type="password" 
            placeholder="Password"
            style={{ marginBottom: '1rem' }}
          />
          <Button variant="primary">
            Login
          </Button>
        </form>
      </Card>
    </Container>
  );
};

export default Login; 