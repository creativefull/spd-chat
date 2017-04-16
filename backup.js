return (
      <TouchableOpacity>
        <View style={{ alignItems:'center', padding:10, flexDirection:'row', borderBottomWidth:1, borderColor:'#f7f7f7' }}>
          {
            renderImages(x.image)
          }
          <View>
            <View style={{ flexDirection:'row', justifyContent:'space-between', width:280 }}>
              <Text style={{ marginLeft:15, fontWeight:'600' }}>{x.first_name} {x.last_name}</Text>
              <Text style={{ color:'#333', fontSize:10 }}>{x.time}</Text>
            </View>
            <View style={{ flexDirection:'row', alignItems:'center' }}>
              <Icon name="done-all" size={15} color="#7dd5df" style={{ marginLeft:15, marginRight:5 }} />
              <Text style={{ fontWeight:'400', color:'#333' }}>{x.message}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )