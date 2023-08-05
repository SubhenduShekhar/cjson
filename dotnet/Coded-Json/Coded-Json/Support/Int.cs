public class Target
{
    public Dictionary<string, string> Properties { get; set; }
}

public class Question
{
    public string question { get; set; }
    public List<String> options { get; set; }
    public String answer { get; set; }
}
public class Source
{
    public Dictionary<String, Dictionary<String, Question>> quiz { get; set; }
}
public class BaseObj
{
    public Source source { get; set; }
    public Dictionary<String, String> target { get; set; }

}