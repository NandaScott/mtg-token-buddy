import React, { useState } from 'react';
import ScryfallCard from 'interfaces/scryfall-card';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  image: {
    marginRight: theme.spacing(2),
  },
  nameBlock: {
    display: 'flex',
    padding: theme.spacing(),
    borderStyle: 'solid',
    borderWidth: '2px 1px 0px 1px',
    borderRadius: '4px 4px 0px 0px',
  },
  name: {
    flexGrow: 1,
  },
  typeLine: {
    padding: theme.spacing(),
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  oracle: {
    borderStyle: 'solid',
    borderWidth: '0px 1px 2px 1px',
    borderRadius: '0px 0px 4px 4px',
    padding: theme.spacing(),
  },
}));

interface TokenDisplayProps {
  tokens: ScryfallCard[];
}

export default function TokenDisplay(props: TokenDisplayProps) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState<string | boolean>(false);
  const { tokens } = props;

  const handleChange =
    (panel: string) =>
    (event: React.ChangeEvent<Record<string, never>>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div className={classes.root}>
      {tokens.map((token) => (
        <Accordion
          key={`Accordion-${token.id}`}
          expanded={expanded === token.id}
          onChange={handleChange(token.id)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon key={`ExpandMoreIcon-${token.id}`} />}
            key={`AccordionSummary-${token.id}`}
          >
            <Typography key={`TokenName-${token.id}`}>{token.name}</Typography>
          </AccordionSummary>
          <AccordionDetails key={`AccordionDetails-${token.id}`}>
            <img
              key={`Image-${token.id}`}
              src={token.image_uris?.small}
              alt={token.name}
              className={classes.image}
            />
            <div className={classes.details} key={`DetailsWrapper-${token.id}`}>
              <div className={classes.nameBlock} key={`NameBlock-${token.id}`}>
                <Typography className={classes.name} key={`Name-${token.id}`}>
                  {token.name}
                </Typography>
                <div key={`ManaCost-${token.mana_cost}`}>{token.mana_cost}</div>
              </div>
              <Typography
                className={classes.typeLine}
                key={`Typeline-${token.id}`}
              >
                {token.type_line}
              </Typography>
              <Typography
                className={classes.oracle}
                key={`OracleText-${token.id}`}
              >
                {token.oracle_text || 'No Oracle Text'}
              </Typography>
            </div>
          </AccordionDetails>
          <AccordionActions key={`AccordionActions-${token.id}`}>
            <Button
              color="primary"
              href={`https://scryfall.com/search?q=oracleid:${token.oracle_id}+include:extras&unique=prints&as=grid&order=released`}
              target="_blank"
              key={`PrintingsButton-${token.id}`}
            >
              Show all printings
            </Button>
            <Button
              color="primary"
              href={token.scryfall_uri}
              target="_blank"
              key={`ScryfallButton-${token.id}`}
            >
              Open in Scryfall
            </Button>
          </AccordionActions>
        </Accordion>
      ))}
    </div>
  );
}
