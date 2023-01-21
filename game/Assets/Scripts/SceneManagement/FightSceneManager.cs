using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FightSceneManager : MonoBehaviour {
    
	private PrefabFactory prefabFactory = null;
    
	private EmpireCore empireCore = null;
	private RepublicCore republicCore = null;
	private EmpireSatellite empireSatellite0 = null;
	private EmpireSatellite empireSatellite1 = null;
	private RepublicSatellite republicSatellite0 = null;
	private RepublicSatellite republicSatellite1 = null;
    
    void Start() {
        // get the prefab factory
        prefabFactory = gameObject.GetComponent<PrefabFactory>();
        
        // load map
        // TODO
        
        // load start buildings
        empireCore = prefabFactory.createBuildingFromPrefab<EmpireCore>("Prefabs/Box");
        empireCore.transform.position = new Vector3(-1, -1, -1);
        empireSatellite0 = prefabFactory.createBuildingFromPrefab<EmpireSatellite>("Prefabs/Satellite");
        empireSatellite0.transform.position = new Vector3(-3, -3, -3);
        empireSatellite1 = prefabFactory.createBuildingFromPrefab<EmpireSatellite>("Prefabs/Satellite");
        empireSatellite1.transform.position = new Vector3(-5, -5, -5);
        
        republicCore = prefabFactory.createBuildingFromPrefab<RepublicCore>("Prefabs/Box");
        republicCore.transform.position = new Vector3(1, 1, 1);
        republicSatellite0 = prefabFactory.createBuildingFromPrefab<RepublicSatellite>("Prefabs/Satellite");
        republicSatellite0.transform.position = new Vector3(3, 3, 3);
        republicSatellite1 = prefabFactory.createBuildingFromPrefab<RepublicSatellite>("Prefabs/Satellite");
        republicSatellite1.transform.position = new Vector3(5, 5, 5);
        
        // load start units
        
        Debug.Log(this.GetType().Name + " started");
    }

    void Update() {
        
    }
}
