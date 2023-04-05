import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import styles from './SideBlock.module.scss';

interface ISideBlockProps {
  title: string;
  children: React.ReactNode;
}

const SideBlock = ({ title, children }: ISideBlockProps) => (
  <Paper classes={{ root: styles.root }}>
    <Typography variant="h6" classes={{ root: styles.title }}>
      {title}
    </Typography>
    {children}
  </Paper>
);

export default SideBlock;
