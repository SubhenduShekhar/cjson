package com.codedjson.templates;

import java.util.HashMap;
import java.util.List;

public class SimpleJson extends Pure{
    public List<String> subjects;
    public HashMap<String, List<String>> expectedClasses;
    public int maxScore;
    public boolean isGradable;
    public double cutOffGrade;
}
