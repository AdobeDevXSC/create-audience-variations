/*
 * <license header>
 */

import React, { useState, useEffect } from "react";
import { attach } from "@adobe/uix-guest";
import {
  Flex,
  Provider,
  View,
  defaultTheme,
  Text,
  ButtonGroup,
  SearchField,
  ActionButton,
  ListView,
  Item,
  Divider
} from "@adobe/react-spectrum";
import actionWebInvoke from '../utils';
import allActions from '../config.json';
import { extensionId, tenet, apiKey } from "./Constants";

export default function () {
  console.log('in modal');
  const updateSearchedAudience = (item) => {
    if (item)
      return setSearchedAudience([...searchedAudience, currentKey]);
    else
      return [];
  };
  const updateSelectedAudiences = (item) => {
    if (item) {
      const { currentKey } = item;
      return setSelectedAudiences([...selectedAudiences, currentKey]);
    } else
      return [];
  };
  const [guestConnection, setGuestConnection] = useState();
  const [searchValue, setSearchValue] = useState('')
  const [audiences, setAudiences] = useState([]);
  const [selectedAudiences, setSelectedAudiences] = useState(updateSelectedAudiences);
  const [searchedAudience, setSearchedAudience] = useState(updateSearchedAudience);

  useEffect(() => {
    (async () => {
      const guestConnection = await attach({ id: extensionId });
      setGuestConnection(guestConnection);
      fetchAudiences(guestConnection);
    })();
  }, []);

  const onCloseHandler = () => {
    guestConnection.host.modal.close();
  };

  return (
    <Provider theme={defaultTheme} colorScheme='light'>
      <View width="100%">
        <Flex direction='column' width='100%' gap={"size-100"}>
          <SearchField
            value={searchValue}
            onChange={setSearchValue}
            label="Audience Search"
            onSubmit={updateSearchedAudience} />
          <Divider orientation="horizontal" size='S' />
          <ListView
            selectionStyle='checkbox'
            width="100%"
            aria-label="ListView with controlled selection"
            selectionMode="multiple"
            items={audiences}
            selectedKeys={selectedAudiences}
            onSelectionChange={updateSelectedAudiences}
          >
            {(item) => (
              <Item key={item.name}>
                {item.name}
              </Item>
            )}
          </ListView>
        </Flex>
        <Flex width="100%" justifyContent="space-between" direction="row" marginTop="size-400">
          <ButtonGroup>
            <ActionButton variant="primary" onPress={() => createVariations(guestConnection)}>Create Variations</ActionButton>
          </ButtonGroup>
          <Text maxHeight={"size-100"}>Version 1.3</Text>
        </Flex>
      </View >
    </Provider >
  );

  async function createVariations(conn) {
   
  }

  async function fetchAudiences(conn) {

  }
}
