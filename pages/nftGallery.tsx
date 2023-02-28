import * as React from 'react';
import {serverIPP} from '../values/strings';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Searchbar} from 'react-native-paper';
import ScreenWrapper from '../@components/ScreenWrapper';

export const NftGallery = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getNftImgs();
  }, []);

  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);

  const [nftImgs, setnftImgs] = React.useState([]);
  const getNftImgs = () => {
    fetch('http:/' + serverIPP + '/nftimg', {
      method: 'GET',
    })
      .then(res => {
        if (res.ok) {
          res.json().then(resData => {
            // console.log(resData);
            setnftImgs(resData);
            setTimeout(() => {
              setRefreshing(false);
            }, 1000);
          });
        } else {
          console.error('res error when getting nftImgs!');
        }
      })
      .catch(e => {
        console.log(e.message);
      });
  };
  React.useState(onRefresh);

  // console.log(nftImgs);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        onSubmitEditing={() => {
          Alert.alert('搜索功能暂未启用');
        }}
        // theme={theme}
      />
      <ScreenWrapper contentContainerStyle={styles.content}>
        {nftImgs?.map((nftImg, index) => {
          // console.log(uri.url);
          return (
            <View key={nftImg?.id} style={styles.item}>
              <Image source={{uri: nftImg?.url}} style={styles.photo} />
            </View>
          );
        })}
      </ScreenWrapper>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ...Platform.select({
    web: {
      content: {
        // there is no 'grid' type in RN :(
        display: 'grid' as 'none',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gridRowGap: '8px',
        gridColumnGap: '8px',
        padding: 8,
      },
      item: {
        width: '100%',
        height: 150,
      },
    },
    default: {
      content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 4,
      },
      item: {
        height: Dimensions.get('window').width / 2,
        width: '50%',
        padding: 4,
      },
    },
  }),
  photo: {
    flex: 1,
    resizeMode: 'cover',
  },
  screen: {
    flex: 1,
  },
});
