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
    conn.host.modal.set({ loading: true });
    const headers = {
      'Authorization': 'Bearer ' + guestConnection.sharedContext.get('auth').imsToken,
      'x-gw-ims-org-id': guestConnection.sharedContext.get('auth').imsOrg
    };

    const { model, path } = await guestConnection.host.contentFragment.getContentFragment();
    console.log(selectedAudiences);
    const params = {
      aemHost: `https://${guestConnection.sharedContext.get('aemHost')}`,
      selectedAudiences: selectedAudiences,
      modelPath: model.path,
      fragmentPath: path.replace('/content/dam', '/api/assets')
    };

    const action = 'create-variations';

    try {
      const actionResponse = await actionWebInvoke(allActions[action], headers, params);
      console.log(`Response from ${action}:`, actionResponse);
      onCloseHandler();
    } catch (e) {
      console.error(e)
    }
  }

  async function fetchAudiences(conn) {
    console.log('fetch audiences');
    const headers = {
      'Authorization': 'Bearer ' + conn.sharedContext.get('auth').imsToken,
      'x-gw-ims-org-id': conn.sharedContext.get('auth').imsOrg
    };

    const params = {
      tenet: tenet,
      apiKey: apiKey
    };

    const action = 'fetch-audiences';

    try {
      console.log(allActions[action]);
      const actionResponse = await actionWebInvoke(allActions[action], headers, params);

      if (actionResponse.hasOwnProperty('data')) {
        let n = 0;
        const items = actionResponse.data.audienceConfigurationList.items[0].audiences.map((item) => {
          return { id: n++, name: item }
        });

        setAudiences(items);
      } else {
        const items = actionResponse.audiences.filter((item) => {
          if (item.name)
            return { id: item.id, name: item.name }
        });
        setAudiences(items);
      }

      console.log(`Response from ${action}:`, actionResponse)
    } catch (e) {
      console.error(e)
    }
    conn.host.modal.set({ loading: false });
  }
}
