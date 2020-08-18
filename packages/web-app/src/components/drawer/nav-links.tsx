import React from 'react';
import { useLocation, Link } from 'react-router-dom';

import { Divider, List, Hidden, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Explore, BubbleChart, Assessment, GitHub } from '@material-ui/icons';

export interface BaseDrawerLink {
  label: string;
  icon: React.ReactNode;
}

export interface RoutedDrawerLink extends BaseDrawerLink {
  to: string;
}

export interface ExternalDrawerLink extends BaseDrawerLink {
  href: string;
  target?: string;
}

export type DrawerLink = RoutedDrawerLink | ExternalDrawerLink;

export type NavLinksProps = {
  additionalLinks?: DrawerLink[];
};

const ALWAYS_ON_LINKS: DrawerLink[] = [
  {
    label: 'Explore',
    icon: <Explore />,
    to: '/explore'
  },
  {
    label: 'Visualize',
    icon: <BubbleChart />,
    to: '/visualize'
  },
  {
    label: 'Analyze',
    icon: <Assessment />,
    to: '/analyze'
  }
];

const AUTO_HIDE_LINKS: DrawerLink[] = [
  {
    label: 'Open in GitHub',
    icon: <GitHub />,
    href: 'https://github.com/abdes',
    target: '_blank'
  }
];

const renderLinks = (links: DrawerLink[]): React.ReactNode =>
  links.map((link) => {
    const component = (link as RoutedDrawerLink).to ? Link : 'a';
    const location = useLocation();
    const selected = location.pathname === (link as RoutedDrawerLink).to;
    return (
      <ListItem
        button
        key={link.label}
        component={component}
        to={(link as RoutedDrawerLink).to}
        href={(link as ExternalDrawerLink).href}
        target={(link as ExternalDrawerLink).target}
        selected={selected}
      >
        <ListItemIcon>{link.icon}</ListItemIcon>
        <ListItemText primary={link.label} />
      </ListItem>
    );
  });

export const NavLinks: React.FC<NavLinksProps> = ({ additionalLinks }) => {
  return (
    <List>
      {renderLinks(ALWAYS_ON_LINKS)}
      {additionalLinks && <Divider />}
      {additionalLinks && renderLinks(additionalLinks)}
      <Hidden smUp>
        <Divider />
        {renderLinks(AUTO_HIDE_LINKS)}
      </Hidden>
    </List>
  );
};
