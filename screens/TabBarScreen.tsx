import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Linking,
  Platform,
  ScrollView,
} from 'react-native';
import { Component } from 'react';
import { connect } from 'react-redux';
import BarycLoader from '~/components/BarycLoader.tsx';
import { Button, Rating } from 'react-native-elements';
import * as i18n from '~/helpers/i18n.js';
import { barAssetsConstants } from '~/constants/barAssetsConstants.ts';
import palette from '~/constants/Colors.ts';
import { showLocation } from 'react-native-map-link';
import * as Location from 'expo-location';

class TabBarScreen extends Component {
  state = {
    bar: {},
    isLoading: true,
  };

  async componentDidMount() {
    let bar = {};
    for (const tempBar of this.props.bars) {
      if (tempBar.id === this.props.route.params.barId) {
        bar = tempBar;
      }
    }
    this.setState({
      bar: bar,
      isLoading: false,
    });
  }

  async openLocation(serviceName) {
    let userLocation = null;
    try {
      const { status } = await Location.requestPermissionsAsync();
      if (status == 'granted') {
        userLocation = await Location.getCurrentPositionAsync({ accuracy: 5 });
      }
    } catch (error) {
      const action = {
        type: 'DISPLAY_NOTIFICATION',
        notificationText: i18n.t('global.error'),
      };
      this.props.dispatch(action);
    } finally {
      await showLocation({
        latitude: this.state.bar.coordinates[1],
        longitude: this.state.bar.coordinates[0],
        sourceLatitude:
          userLocation != null ? userLocation.coords.latitude : null,
        sourceLongitude:
          userLocation != null ? userLocation.coords.longitude : null,
        app: serviceName,
        directionsMode: 'walk',
      });
    }
  }

  openNativeMapsApp = () => {
    const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    const url =
      scheme +
      `${this.state.bar.coordinates[1]},${this.state.bar.coordinates[0]}`;
    Linking.openURL(url);
  };

  render(): JSX.Element {
    return (
      <View style={[styles.container]}>
        <BarycLoader
          visible={this.state.isLoading}
          containerStyle={styles.loaderContainer}
          type={'flowing'}
        />
        {!this.state.isLoading && (
          <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            <View style={styles.barNameAndRating}>
              <Text style={styles.title}>{this.state.bar.nom}</Text>
              <Rating
                style={styles.rating}
                tintColor="white"
                fractions={1}
                readonly
                imageSize={16}
                startingValue={this.state.bar.note}
              />
            </View>
            <Text style={styles.address}>{this.state.bar.adresse}</Text>
            <Text style={styles.description}>
              "{this.state.bar.renseignements}"
            </Text>
            <Text style={styles.mainAssetsTitle}>
              {i18n.t('TabBarScreen.mainAssets')} :
            </Text>
            {this.state.bar.specificites.map(specificity => {
              return (
                <View key={specificity} style={styles.mainAssetsContainer}>
                  <Image
                    source={barAssetsConstants[specificity]}
                    style={styles.mainAssetImg}
                  />
                  <Text style={styles.mainAssetLabel}> {specificity}</Text>
                </View>
              );
            })}
            <Button
              raised={true}
              title={i18n.t('TabBarScreen.showOnGoogleMaps')}
              titleStyle={styles.goWithMapsBtnText}
              buttonStyle={styles.goWithGgMapsBtn}
              containerStyle={styles.goWithGgMapsBtnContainer}
              onPress={async () => await this.openLocation('google-maps')}
            />
            <Button
              raised={true}
              title={i18n.t('TabBarScreen.showOnCityMapper')}
              titleStyle={styles.goWithMapsBtnText}
              buttonStyle={styles.goWithCityMapperBtn}
              containerStyle={styles.goWithCityMapperBtnContainer}
              onPress={async () => await this.openLocation('citymapper')}
            />
            <Button
              raised={true}
              title={i18n.t('TabBarScreen.showOnUber')}
              titleStyle={styles.goWithMapsBtnText}
              buttonStyle={styles.goWithUberBtn}
              containerStyle={styles.goWithUberBtnContainer}
              onPress={async () => await this.openLocation('uber')}
            />
            <Button
              raised={true}
              title={
                Platform.OS === 'ios'
                  ? i18n.t('TabBarScreen.showOnAppleMaps')
                  : i18n.t('TabBarScreen.showOnAndroidMaps')
              }
              titleStyle={styles.goWithMapsBtnText}
              buttonStyle={styles.goWithNativeMapsBtn}
              containerStyle={styles.goWithNativeMapsBtnContainer}
              onPress={() => this.openNativeMapsApp()}
            />
          </ScrollView>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    bars: state.bars,
  };
};

export default connect(mapStateToProps)(TabBarScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    paddingHorizontal: 14,
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  barNameAndRating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  address: {
    fontStyle: 'italic',
    fontSize: 12,
    color: palette.orangeLight,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: palette.orangeLight,
  },
  description: {
    fontSize: 14,
    color: palette.greyDark,
    marginTop: 20,
    fontStyle: 'italic',
  },
  mainAssetsTitle: {
    fontWeight: '800',
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
  },
  mainAssetsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  mainAssetLabel: {
    marginRight: 10,
    fontWeight: '300',
  },
  mainAssetImg: {
    width: 30,
    height: 30,
  },
  loaderContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: '33%',
    zIndex: 1000,
  },
  goWithMapsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  goWithGgMapsBtn: {
    backgroundColor: 'rgb(30, 136, 229)',
  },
  goWithUberBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  goWithCityMapperBtn: {
    backgroundColor: 'rgb(76, 175, 80)',
  },
  goWithGgMapsBtnContainer: {
    marginTop: 20,
  },
  goWithCityMapperBtnContainer: {
    marginTop: 10,
  },
  goWithUberBtnContainer: {
    marginTop: 10,
  },
  goWithNativeMapsBtnContainer: {
    marginTop: 10,
  },
  goWithNativeMapsBtn: {
    backgroundColor: palette.grey,
  },
  rating: {
    backgroundColor: 'transparent',
  },
});
