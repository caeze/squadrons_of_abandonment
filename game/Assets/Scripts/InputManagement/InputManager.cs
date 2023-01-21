using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InputManager {
    
    public const string CAMERA_FORWARD = "CAMERA_FORWARD";
    public const string CAMERA_BACKWARD = "CAMERA_BACKWARD";
    public const string CAMERA_RIGHTWARD = "CAMERA_RIGHTWARD";
    public const string CAMERA_LEFTWARD = "CAMERA_LEFTWARD";
    public const string CAMERA_ROTATE = "CAMERA_ROTATE";
    
    Dictionary<string, string> currentInputManager = new Dictionary<string, string>();
    Vector3 lastMousePos = new Vector3(0, 0, 0);
    
    public InputManager() {
        // TODO: load from settings
        currentInputManager.Add(InputManager.CAMERA_FORWARD, "w");
        currentInputManager.Add(InputManager.CAMERA_BACKWARD, "s");
        currentInputManager.Add(InputManager.CAMERA_RIGHTWARD, "a");
        currentInputManager.Add(InputManager.CAMERA_LEFTWARD, "d");
        currentInputManager.Add(InputManager.CAMERA_ROTATE, "mouse 2");
        Debug.Log(this.GetType().Name + " started");
    }
    
    /*
     * Returns the amount the mouse wheel scrolled. Downwards means positive
     * values.
     * To be called from the Update() function.
     */
    public float getMouseScrollDelta() {
        return Input.mouseScrollDelta.y;
    }
    
    /*
     * Returns the amount the mouse position moved in x and y direction in
     * pixels since the last call to this function. Down right are positive
     * values.
     * To be called from the Update() function.
     */
    public Vector3 getMousePositionDelta() {
        Vector3 retVal = Input.mousePosition - lastMousePos;
        setLastMousePosToCurrentOne();
        return retVal;
    }
    
    /*
     * Returns if the key corresponding to the given action name is held down.
     * To be called from the Update() function.
     * Example action name: "cameraForward" -> default key: "w".
     */
    public bool keyHeldDown(string actionName) {
        return handleKeyEvents(actionName, 0);
    }
    
    /*
     * Returns if the key corresponding to the given action name was pressed
     * during the last frame.
     * To be called from the Update() function.
     * Example action name: "cameraForward" -> default key: "w".
     */
    public bool keyPressedLastFrame(string actionName) {
        return handleKeyEvents(actionName, 1);
    }
    
    /*
     * Returns if the key corresponding to the given action name was released
     * during the last frame.
     * To be called from the Update() function.
     * Example action name: "cameraForward" -> default key: "w".
     */
    public bool keyReleasedLastFrame(string actionName) {
        return handleKeyEvents(actionName, 2);
    }
    
    /*
     * Sets the last mouse position to the current one.
     */
    public void setLastMousePosToCurrentOne() {
        lastMousePos = Input.mousePosition;
    }
    
    /*
     * Handles keyboard events to figure out if keys were pressed, held or
     * released in the last frame.
     */
    private bool handleKeyEvents(string actionName, int type) {
        string keyName = "";
        if (currentInputManager.TryGetValue(actionName, out keyName)) {
            if (type == 0) {
                return Input.GetKey(keyName);
            }
            if (type == 1) {
                return Input.GetKeyDown(keyName);
            }
            if (type == 2) {
                return Input.GetKeyUp(keyName);
            }
        }
        return false;
    }
}



        
        // TODO: delete
        /*
        backspace
        delete
        tab
        clear
        return
        pause
        escape
        space
        [0]
        [1]
        [2]
        [3]
        [4]
        [5]
        [6]
        [7]
        [8]
        [9]
        [.]
        [/]
        [*]
        [-]
        [+]
        equals
        enter
        up
        down
        right
        left
        insert
        home
        end
        page up
        page down
        f1
        f2
        f3
        f4
        f5
        f6
        f7
        f8
        f9
        f10
        f11
        f12
        f13
        f14
        f15
        0
        1
        2
        3
        4
        5
        6
        7
        8
        9
        -
        =
        !
        @
        #
        $
        %
        ^
        &
        *
        (
        )
        _
        +
        [
        ]
        `
        {
        }
        ~
        ;
        '
        \
        :
        "
        |
        ,
        .
        /
        <
        >
        ?
        a
        b
        c
        d
        e
        f
        g
        h
        i
        j
        k
        l
        m
        n
        o
        p
        q
        r
        s
        t
        u
        v
        w
        x
        y
        z
        numlock
        caps lock
        scroll lock
        right shift
        left shift
        right ctrl
        left ctrl
        right alt
        left alt
        right cmd
        left cmd
        right super
        left super
        alt gr
        compose
        help
        print screen
        sys req
        break
        menu
        power
        euro
        undo
        mouse 0
        mouse 1
        mouse 2
        mouse 3
        mouse 4
        mouse 5
        mouse 6
        */
        
        
        /*keyNameToCode.Add("Backspace", KeyCode.Backspace);
        keyNameToCode.Add("Delete", KeyCode.Delete);
        keyNameToCode.Add("Tab", KeyCode.Tab);
        keyNameToCode.Add("Clear", KeyCode.Clear);
        keyNameToCode.Add("Return", KeyCode.Return);
        keyNameToCode.Add("Pause", KeyCode.Pause);
        keyNameToCode.Add("Escape", KeyCode.Escape);
        keyNameToCode.Add("Space", KeyCode.Space);
        keyNameToCode.Add("Keypad0", KeyCode.Keypad0);
        keyNameToCode.Add("Keypad1", KeyCode.Keypad1);
        keyNameToCode.Add("Keypad2", KeyCode.Keypad2);
        keyNameToCode.Add("Keypad3", KeyCode.Keypad3);
        keyNameToCode.Add("Keypad4", KeyCode.Keypad4);
        keyNameToCode.Add("Keypad5", KeyCode.Keypad5);
        keyNameToCode.Add("Keypad6", KeyCode.Keypad6);
        keyNameToCode.Add("Keypad7", KeyCode.Keypad7);
        keyNameToCode.Add("Keypad8", KeyCode.Keypad8);
        keyNameToCode.Add("Keypad9", KeyCode.Keypad9);
        keyNameToCode.Add("KeypadPeriod", KeyCode.KeypadPeriod);
        keyNameToCode.Add("KeypadDivide", KeyCode.KeypadDivide);
        keyNameToCode.Add("KeypadMultiply", KeyCode.KeypadMultiply);
        keyNameToCode.Add("KeypadMinus", KeyCode.KeypadMinus);
        keyNameToCode.Add("KeypadPlus", KeyCode.KeypadPlus);
        keyNameToCode.Add("KeypadEnter", KeyCode.KeypadEnter);
        keyNameToCode.Add("KeypadEquals", KeyCode.KeypadEquals);
        keyNameToCode.Add("UpArrow", KeyCode.UpArrow);
        keyNameToCode.Add("DownArrow", KeyCode.DownArrow);
        keyNameToCode.Add("RightArrow", KeyCode.RightArrow);
        keyNameToCode.Add("LeftArrow", KeyCode.LeftArrow);
        keyNameToCode.Add("Insert", KeyCode.Insert);
        keyNameToCode.Add("Home", KeyCode.Home);
        keyNameToCode.Add("End", KeyCode.End);
        keyNameToCode.Add("PageUp", KeyCode.PageUp);
        keyNameToCode.Add("PageDown", KeyCode.PageDown);
        keyNameToCode.Add("F1", KeyCode.F1);
        keyNameToCode.Add("F2", KeyCode.F2);
        keyNameToCode.Add("F3", KeyCode.F3);
        keyNameToCode.Add("F4", KeyCode.F4);
        keyNameToCode.Add("F5", KeyCode.F5);
        keyNameToCode.Add("F6", KeyCode.F6);
        keyNameToCode.Add("F7", KeyCode.F7);
        keyNameToCode.Add("F8", KeyCode.F8);
        keyNameToCode.Add("F9", KeyCode.F9);
        keyNameToCode.Add("F10", KeyCode.F10);
        keyNameToCode.Add("F11", KeyCode.F11);
        keyNameToCode.Add("F12", KeyCode.F12);
        keyNameToCode.Add("F13", KeyCode.F13);
        keyNameToCode.Add("F14", KeyCode.F14);
        keyNameToCode.Add("F15", KeyCode.F15);
        keyNameToCode.Add("Alpha0", KeyCode.Alpha0);
        keyNameToCode.Add("Alpha1", KeyCode.Alpha1);
        keyNameToCode.Add("Alpha2", KeyCode.Alpha2);
        keyNameToCode.Add("Alpha3", KeyCode.Alpha3);
        keyNameToCode.Add("Alpha4", KeyCode.Alpha4);
        keyNameToCode.Add("Alpha5", KeyCode.Alpha5);
        keyNameToCode.Add("Alpha6", KeyCode.Alpha6);
        keyNameToCode.Add("Alpha7", KeyCode.Alpha7);
        keyNameToCode.Add("Alpha8", KeyCode.Alpha8);
        keyNameToCode.Add("Alpha9", KeyCode.Alpha9);
        keyNameToCode.Add("Exclaim", KeyCode.Exclaim);
        keyNameToCode.Add("DoubleQuote", KeyCode.DoubleQuote);
        keyNameToCode.Add("Hash", KeyCode.Hash);
        keyNameToCode.Add("Dollar", KeyCode.Dollar);
        keyNameToCode.Add("Percent", KeyCode.Percent);
        keyNameToCode.Add("Ampersand", KeyCode.Ampersand);
        keyNameToCode.Add("Quote", KeyCode.Quote);
        keyNameToCode.Add("LeftParen", KeyCode.LeftParen);
        keyNameToCode.Add("RightParen", KeyCode.RightParen);
        keyNameToCode.Add("Asterisk", KeyCode.Asterisk);
        keyNameToCode.Add("Plus", KeyCode.Plus);
        keyNameToCode.Add("Comma", KeyCode.Comma);
        keyNameToCode.Add("Minus", KeyCode.Minus);
        keyNameToCode.Add("Period", KeyCode.Period);
        keyNameToCode.Add("Slash", KeyCode.Slash);
        keyNameToCode.Add("Colon", KeyCode.Colon);
        keyNameToCode.Add("Semicolon", KeyCode.Semicolon);
        keyNameToCode.Add("Less", KeyCode.Less);
        keyNameToCode.Add("Equals", KeyCode.Equals);
        keyNameToCode.Add("Greater", KeyCode.Greater);
        keyNameToCode.Add("Question", KeyCode.Question);
        keyNameToCode.Add("At", KeyCode.At);
        keyNameToCode.Add("LeftBracket", KeyCode.LeftBracket);
        keyNameToCode.Add("Backslash", KeyCode.Backslash);
        keyNameToCode.Add("RightBracket", KeyCode.RightBracket);
        keyNameToCode.Add("Caret", KeyCode.Caret);
        keyNameToCode.Add("Underscore", KeyCode.Underscore);
        keyNameToCode.Add("BackQuote", KeyCode.BackQuote);
        keyNameToCode.Add("A", KeyCode.A);
        keyNameToCode.Add("B", KeyCode.B);
        keyNameToCode.Add("C", KeyCode.C);
        keyNameToCode.Add("D", KeyCode.D);
        keyNameToCode.Add("E", KeyCode.E);
        keyNameToCode.Add("F", KeyCode.F);
        keyNameToCode.Add("G", KeyCode.G);
        keyNameToCode.Add("H", KeyCode.H);
        keyNameToCode.Add("I", KeyCode.I);
        keyNameToCode.Add("J", KeyCode.J);
        keyNameToCode.Add("K", KeyCode.K);
        keyNameToCode.Add("L", KeyCode.L);
        keyNameToCode.Add("M", KeyCode.M);
        keyNameToCode.Add("N", KeyCode.N);
        keyNameToCode.Add("O", KeyCode.O);
        keyNameToCode.Add("P", KeyCode.P);
        keyNameToCode.Add("Q", KeyCode.Q);
        keyNameToCode.Add("R", KeyCode.R);
        keyNameToCode.Add("S", KeyCode.S);
        keyNameToCode.Add("T", KeyCode.T);
        keyNameToCode.Add("U", KeyCode.U);
        keyNameToCode.Add("V", KeyCode.V);
        keyNameToCode.Add("W", KeyCode.W);
        keyNameToCode.Add("X", KeyCode.X);
        keyNameToCode.Add("Y", KeyCode.Y);
        keyNameToCode.Add("Z", KeyCode.Z);
        keyNameToCode.Add("LeftCurlyBracket", KeyCode.LeftCurlyBracket);
        keyNameToCode.Add("Pipe", KeyCode.Pipe);
        keyNameToCode.Add("RightCurlyBracket", KeyCode.RightCurlyBracket);
        keyNameToCode.Add("Tilde", KeyCode.Tilde);
        keyNameToCode.Add("Numlock", KeyCode.Numlock);
        keyNameToCode.Add("CapsLock", KeyCode.CapsLock);
        keyNameToCode.Add("ScrollLock", KeyCode.ScrollLock);
        keyNameToCode.Add("RightShift", KeyCode.RightShift);
        keyNameToCode.Add("LeftShift", KeyCode.LeftShift);
        keyNameToCode.Add("RightControl", KeyCode.RightControl);
        keyNameToCode.Add("LeftControl", KeyCode.LeftControl);
        keyNameToCode.Add("RightAlt", KeyCode.RightAlt);
        keyNameToCode.Add("LeftAlt", KeyCode.LeftAlt);
        keyNameToCode.Add("LeftMeta", KeyCode.LeftMeta);
        keyNameToCode.Add("LeftCommand", KeyCode.LeftCommand);
        keyNameToCode.Add("LeftApple", KeyCode.LeftApple);
        keyNameToCode.Add("LeftWindows", KeyCode.LeftWindows);
        keyNameToCode.Add("RightMeta", KeyCode.RightMeta);
        keyNameToCode.Add("RightCommand", KeyCode.RightCommand);
        keyNameToCode.Add("RightApple", KeyCode.RightApple);
        keyNameToCode.Add("RightWindows", KeyCode.RightWindows);
        keyNameToCode.Add("AltGr", KeyCode.AltGr);
        keyNameToCode.Add("Help", KeyCode.Help);
        keyNameToCode.Add("Print", KeyCode.Print);
        keyNameToCode.Add("SysReq", KeyCode.SysReq);
        keyNameToCode.Add("Break", KeyCode.Break);
        keyNameToCode.Add("Menu", KeyCode.Menu);
        keyNameToCode.Add("Mouse0", KeyCode.Mouse0);
        keyNameToCode.Add("Mouse1", KeyCode.Mouse1);
        keyNameToCode.Add("Mouse2", KeyCode.Mouse2);
        keyNameToCode.Add("Mouse3", KeyCode.Mouse3);
        keyNameToCode.Add("Mouse4", KeyCode.Mouse4);
        keyNameToCode.Add("Mouse5", KeyCode.Mouse5);
        keyNameToCode.Add("Mouse6", KeyCode.Mouse6);*/
