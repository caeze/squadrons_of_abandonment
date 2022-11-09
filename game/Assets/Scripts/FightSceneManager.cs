using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FightSceneManager : MonoBehaviour {
    
	private PrefabFactory prefabFactory = null;
    
	private EmpireCore empireCore = null;
	private RepublicCore republicCore = null;
    
    void Start() {
        Debug.Log(this.GetType().Name + " component starting with parent game object " + name);
        
        // get the prefab factory
        prefabFactory = gameObject.GetComponent<PrefabFactory>();
        
        // load map
        // TODO
        
        // load start buildings
        empireCore = prefabFactory.createBuildingFromPrefab<EmpireCore>("Prefabs/Box");
        republicCore = prefabFactory.createBuildingFromPrefab<RepublicCore>("Prefabs/Box");
        
        // load start units
        
        Debug.Log(this.GetType().Name + " started.");
    }

    void Update() {
        
    }
}
